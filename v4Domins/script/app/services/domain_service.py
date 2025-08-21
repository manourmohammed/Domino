import os
import re
import socket
import ssl
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Optional

import geoip2.database
import requests
import whois
from bs4 import BeautifulSoup

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GEOIP_PATH = os.path.join(BASE_DIR, '..', 'data', 'GeoLite2-City.mmdb')

if not os.path.exists(GEOIP_PATH):
    raise FileNotFoundError(f"GeoLite2 DB not found at: {GEOIP_PATH}")

geoip_reader = geoip2.database.Reader(GEOIP_PATH)


class DomainService:

    @staticmethod
    def get_expiration(domain: str) -> Optional[datetime]:
        try:
            info = whois.whois(domain)
            exp = info.expiration_date
            return exp[0] if isinstance(exp, list) else exp
        except Exception:
            return None

    @staticmethod
    def check_online(domain: str) -> bool:
        try:
            socket.gethostbyname(domain)
            return True
        except Exception:
            return False

    @staticmethod
    def detect_status(exp: Optional[datetime]) -> str:
        if exp is None:
            return "Inconnue"
        now = datetime.now()
        if exp < now:
            return "Expiré"
        elif (exp - now).days <= 15:
            return "Bientôt"
        else:
            return "Valide"

    @staticmethod
    def get_http_response(domain: str):
        try:
            # Essayer HTTPS d'abord
            response = requests.get(f"https://{domain}",
                                    headers={
                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
                                    timeout=10,
                                    allow_redirects=True)
            return response
        except Exception:
            try:
                # Si HTTPS échoue, essayer HTTP
                response = requests.get(f"http://{domain}",
                                        headers={
                                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
                                        timeout=10,
                                        allow_redirects=True)
                return response
            except Exception:
                return None

    import re

    @staticmethod
    def detect_cms_details_from_html(domain: str, html: Optional[str]):
        """Détection améliorée du CMS avec version, thème et plugins pour tous les CMS"""
        # Initialisation par défaut
        cms, version, theme, plugins = "Inconnu", "-", "-", 0

        if not html:
            return domain, "Inaccessible", "-", "-", 0

        html_lower = html.lower()
        soup = BeautifulSoup(html, 'html.parser')

        # WordPress
        if ("wp-content" in html_lower or
                "wp-includes" in html_lower or
                "wordpress" in html_lower or
                soup.find("meta", attrs={"name": "generator", "content": lambda x: x and "wordpress" in x.lower()})):

            cms = "WordPress"

            # Version WordPress
            meta = soup.find("meta", attrs={"name": "generator"})
            if meta and meta.get("content"):
                content = meta["content"].lower()
                if "wordpress" in content:
                    parts = content.split()
                    for i, part in enumerate(parts):
                        if "wordpress" in part and i + 1 < len(parts):
                            version = parts[i + 1]
                            break

            # Si pas de version dans meta, chercher dans les scripts/CSS
            if version == "-":
                version_patterns = [
                    r'wp-includes/js/.*?ver=([0-9\.]+)',
                    r'wp-content/themes/.*?ver=([0-9\.]+)',
                    r'/wp-includes/.*?\?ver=([0-9\.]+)'
                ]
                for pattern in version_patterns:
                    match = re.search(pattern, html)
                    if match:
                        version = match.group(1)
                        break

            # Thème WordPress
            for link in soup.find_all("link", href=True):
                href = link["href"]
                if "/wp-content/themes/" in href:
                    try:
                        theme = href.split("/wp-content/themes/")[1].split("/")[0]
                        break
                    except:
                        pass

            # Plugins WordPress (compter les plugins uniques)
            plugin_set = set()
            for tag in soup.find_all(["script", "link"]):
                src_or_href = tag.get("src") or tag.get("href") or ""
                if "/wp-content/plugins/" in src_or_href:
                    try:
                        plugin_name = src_or_href.split("/wp-content/plugins/")[1].split("/")[0]
                        plugin_set.add(plugin_name)
                    except:
                        pass
            plugins = len(plugin_set)

        # Joomla
        elif ("index.php?option=" in html_lower or
              "com_content" in html_lower or
              "joomla" in html_lower or
              soup.find("meta", attrs={"name": "generator", "content": lambda x: x and "joomla" in x.lower()})):

            cms = "Joomla"

            # Version Joomla
            meta = soup.find("meta", attrs={"name": "generator"})
            if meta and meta.get("content"):
                content = meta["content"]
                joomla_match = re.search(r'joomla!?\s*([0-9\.]+)', content, re.IGNORECASE)
                if joomla_match:
                    version = joomla_match.group(1)

            # Thème Joomla (template)
            template_patterns = [
                r'/templates/([^/]+)/',
                r'templateUrl.*?templates/([^/\'\"]+)',
            ]
            for pattern in template_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                if matches:
                    # Prendre le premier template trouvé qui n'est pas 'system'
                    for match in matches:
                        if match != 'system' and match != 'administrator':
                            theme = match
                            break
                    if theme != "-":
                        break

            # Extensions Joomla (compter com_, mod_, plg_)
            extension_patterns = [
                r'option=com_([^&\'"]+)',
                r'modules/mod_([^/\'"]+)',
                r'plugins/[^/]+/plg_([^/\'"]+)'
            ]
            extension_set = set()
            for pattern in extension_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                extension_set.update(matches)
            plugins = len(extension_set)

        # Drupal
        elif ("sites/all/" in html_lower or
              "drupal.js" in html_lower or
              "drupal" in html_lower or
              soup.find("meta", attrs={"name": "generator", "content": lambda x: x and "drupal" in x.lower()})):

            cms = "Drupal"

            # Version Drupal
            meta = soup.find("meta", attrs={"name": "generator"})
            if meta and meta.get("content"):
                content = meta["content"]
                drupal_match = re.search(r'drupal\s*([0-9\.]+)', content, re.IGNORECASE)
                if drupal_match:
                    version = drupal_match.group(1)

            # Chercher dans les scripts/CSS Drupal
            if version == "-":
                drupal_patterns = [
                    r'sites/all/modules/.*?drupal-([0-9\.]+)',
                    r'/misc/.*?drupal\.js\?([0-9\.]+)',
                    r'Drupal\.settings.*?version.*?[\'"]([0-9\.]+)[\'"]'
                ]
                for pattern in drupal_patterns:
                    match = re.search(pattern, html, re.IGNORECASE)
                    if match:
                        version = match.group(1)
                        break

            # Thème Drupal
            theme_patterns = [
                r'/sites/all/themes/([^/\'\"]+)',
                r'/themes/([^/\'\"]+)',
            ]
            for pattern in theme_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                if matches:
                    # Prendre le premier thème qui n'est pas dans les exclusions
                    excluded_themes = ['seven', 'bartik', 'garland', 'minnelli', 'bluemarine']
                    for match in matches:
                        if match.lower() not in excluded_themes:
                            theme = match
                            break
                    if theme != "-":
                        break

            # Modules Drupal
            module_patterns = [
                r'/sites/all/modules/([^/\'\"]+)',
                r'/modules/([^/\'\"]+)',
            ]
            module_set = set()
            for pattern in module_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                # Exclure les modules core
                core_modules = ['system', 'user', 'filter', 'node', 'field', 'text', 'menu', 'block']
                for match in matches:
                    if match.lower() not in core_modules:
                        module_set.add(match)
            plugins = len(module_set)

        # PrestaShop
        elif "prestashop" in html_lower or "blockcart" in html_lower:
            cms = "PrestaShop"

            # Version PrestaShop
            version_patterns = [
                r'prestashop.*?([0-9\.]+)',
                r'ps_version[\'\"]\s*:\s*[\'\"]\s*([0-9\.]+)',
                r'prestashop_version.*?([0-9\.]+)'
            ]
            for pattern in version_patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    version = match.group(1)
                    break

            # Thème PrestaShop
            theme_match = re.search(r'/themes/([^/\'\"]+)', html, re.IGNORECASE)
            if theme_match:
                theme = theme_match.group(1)

            # Modules PrestaShop
            module_matches = re.findall(r'/modules/([^/\'\"]+)', html, re.IGNORECASE)
            plugins = len(set(module_matches))

        # Magento
        elif "mage/cookies.js" in html_lower or "catalog/product/view" in html_lower or "magento" in html_lower:
            cms = "Magento"

            # Version Magento
            version_patterns = [
                r'magento.*?([0-9\.]+)',
                r'mage.*?version.*?([0-9\.]+)',
                r'var BLANK_URL.*?([0-9\.]+)'
            ]
            for pattern in version_patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    version = match.group(1)
                    break

            # Thème Magento
            theme_patterns = [
                r'/skin/frontend/([^/\'\"]+)',
                r'/app/design/frontend/([^/\'\"]+)'
            ]
            for pattern in theme_patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    theme = match.group(1)
                    break

            # Extensions Magento
            extension_matches = re.findall(r'/app/code/local/([^/\'\"]+)', html, re.IGNORECASE)
            plugins = len(set(extension_matches))

        # Shopify
        elif ".myshopify.com" in html_lower or "cdn.shopify.com" in html_lower or "shopify" in html_lower:
            cms = "Shopify"

            # Version Shopify (généralement pas exposée, mais on peut essayer)
            shopify_match = re.search(r'shopify.*?([0-9\.]+)', html, re.IGNORECASE)
            if shopify_match:
                version = shopify_match.group(1)

            # Thème Shopify
            theme_patterns = [
                r'Shopify\.theme\s*=\s*[\'\"]\s*{.*?name.*?[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)',
                r'theme.*?name.*?[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)',
                r'/assets/([^/\'\"]+)\.css'
            ]
            for pattern in theme_patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    potential_theme = match.group(1)
                    if not any(word in potential_theme.lower() for word in ['shopify', 'cdn', 'assets', 'bundle']):
                        theme = potential_theme
                        break

            # Apps Shopify (difficile à détecter, on estime)
            app_indicators = ['shopify-app', 'shopify_app', 'app.shopify']
            app_count = sum(1 for indicator in app_indicators if indicator in html_lower)
            plugins = app_count

        # Wix
        elif "static.parastorage.com" in html_lower or "wix.com" in html_lower or "_wix" in html_lower:
            cms = "Wix"

            # Version Wix
            wix_match = re.search(r'wix.*?([0-9\.]+)', html, re.IGNORECASE)
            if wix_match:
                version = wix_match.group(1)

            # Template Wix
            template_match = re.search(r'templateId[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)', html, re.IGNORECASE)
            if template_match:
                theme = template_match.group(1)

            # Apps Wix
            app_matches = re.findall(r'wixapps\.net/([^/\'\"]+)', html, re.IGNORECASE)
            plugins = len(set(app_matches))

        # Squarespace
        elif ("static.squarespace.com" in html_lower or
              "squarespace.com" in html_lower or
              "squarespace" in domain.lower() or
              "assets.squarespace.com" in html_lower):

            cms = "Squarespace"

            # Version Squarespace
            sq_match = re.search(r'squarespace.*?([0-9\.]+)', html, re.IGNORECASE)
            if sq_match:
                version = sq_match.group(1)

            # Template Squarespace
            template_patterns = [
                r'templateId[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)',
                r'template.*?[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)',
                r'/universal/styles-v2/([^/\'\"]+)'
            ]
            for pattern in template_patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    theme = match.group(1)
                    break

            # Widgets/Plugins Squarespace
            widget_matches = re.findall(r'squarespace\.com/universal/scripts-compressed/([^/\'\"]+)', html,
                                        re.IGNORECASE)
            plugins = len(set(widget_matches))

        elif ("ghost" in html_lower or
                soup.find("meta", attrs={"name": "generator", "content": lambda x: x and "ghost" in x.lower()}) or
                "ghost-url" in html_lower or
                "ghost.org" in html_lower or
                "/ghost/api/" in html_lower or
                "assets/built/" in html_lower):

            cms = "Ghost"

            # Version Ghost
            meta = soup.find("meta", attrs={"name": "generator"})
            if meta and meta.get("content"):
                content = meta["content"]
                ghost_match = re.search(r'ghost\s*([0-9\.]+)', content, re.IGNORECASE)
                if ghost_match:
                    version = ghost_match.group(1)

            # Si pas de version dans meta, chercher dans les API calls ou scripts
            if version == "-":
                version_patterns = [
                    r'/ghost/api/v([0-9\.]+)',
                    r'ghost.*?version.*?[\'"]([0-9\.]+)[\'"]',
                    r'/assets/built/.*?v=([0-9\.]+)'
                ]
                for pattern in version_patterns:
                    match = re.search(pattern, html, re.IGNORECASE)
                    if match:
                        version = match.group(1)
                        break

            # Thème Ghost
            theme_patterns = [
                r'/assets/built/([^/\'\"\.]+)\.css',
                r'theme[\'\"]\s*:\s*[\'\"]\s*([^\'\"]+)',
                r'/content/themes/([^/\'\"]+)',
                r'active_theme.*?[\'"]([^\'\"]+)[\'"]'
            ]
            for pattern in theme_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                if matches:
                    # Exclure les noms génériques
                    excluded = ['ghost', 'built', 'main', 'style', 'app', 'bundle']
                    for match in matches:
                        if match.lower() not in excluded and len(match) > 2:
                            theme = match
                            break
                    if theme != "-":
                        break

            # Apps/Intégrations Ghost (chercher dans les scripts et APIs)
            integration_patterns = [
                r'ghost\.org/integrations/([^/\'\"]+)',
                r'/ghost/api/.*?/([^/\'\"]+)',
                r'ghost-app-([^/\'\"]+)',
                r'data-ghost-([^=\s\'\"]+)'
            ]
            integration_set = set()
            for pattern in integration_patterns:
                matches = re.findall(pattern, html, re.IGNORECASE)
                integration_set.update(matches)

            # Compter aussi les services externes intégrés (analytics, newsletter, etc.)
            external_services = [
                'google-analytics', 'gtag', 'mailchimp', 'convertkit', 'disqus',
                'stripe', 'memberstack', 'zapier', 'typeform'
            ]
            for service in external_services:
                if service in html_lower:
                    integration_set.add(service)

            plugins = len(integration_set)

        # Vérification finale si aucun CMS détecté
        if not cms or cms == "Inconnu":
            domain_lower = domain.lower()
            if "squarespace.com" in domain_lower:
                cms = "Squarespace"
            elif "wordpress.com" in domain_lower:
                cms = "WordPress"
            elif "wix.com" in domain_lower:
                cms = "Wix"
            elif "shopify.com" in domain_lower:
                cms = "Shopify"
            elif "ghost.io" in domain_lower:
                cms = "Ghost"

        print(f"[DEBUG] CMS détecté pour {domain}: {cms} (v.{version}, thème: {theme}, plugins: {plugins})")
        return domain, cms, version, theme, plugins

    @staticmethod
    def get_ping(domain: str) -> Optional[int]:
        try:
            start = time.time()
            response = requests.get(f"https://{domain}", timeout=5)
            return int((time.time() - start) * 1000)
        except Exception:
            return None

    @staticmethod
    def get_http_status(response) -> str:
        return f"{response.status_code} {response.reason}" if response else "Inaccessible"

    @staticmethod
    def get_ssl_expiration(domain: str) -> Optional[str]:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    expire_date = datetime.strptime(ssock.getpeercert()['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    return expire_date.strftime('%Y-%m-%d')
        except Exception:
            return None

    @staticmethod
    def get_whois_details(domain: str):
        try:
            info = whois.whois(domain)
            creation = info.creation_date
            return (creation[0] if isinstance(creation, list) else creation,
                    info.registrar,
                    ", ".join(info.name_servers) if isinstance(info.name_servers, list) else info.name_servers)
        except:
            return None, None, None

    @staticmethod
    def get_ip_address(domain: str) -> Optional[str]:
        try:
            return socket.gethostbyname(domain)
        except Exception:
            return None

    @staticmethod
    def get_server_location(ip: str) -> str:
        try:
            resp = geoip_reader.city(ip)
            return ', '.join(filter(None, [resp.city.name, resp.subdivisions.most_specific.name, resp.country.name]))
        except Exception:
            return "N/A"

    @staticmethod
    def get_availability_and_response_time(domain: str):
        try:
            start = time.time()
            response = requests.get(f"https://{domain}", timeout=5)
            response_time = int((time.time() - start) * 1000)
            availability = 100 if response.status_code == 200 else 0
            return availability, response_time
        except Exception:
            return 0, 0

    @staticmethod
    def process_single_domain(domain: str) -> dict:
        print(f"[DEBUG] Traitement du domaine: {domain}")

        expiration = DomainService.get_expiration(domain)
        online = DomainService.check_online(domain)
        status = DomainService.detect_status(expiration)
        response = DomainService.get_http_response(domain)
        html = response.text if response else None

        # Debug HTML
        if html:
            print(f"[DEBUG] HTML récupéré pour {domain}, taille: {len(html)} caractères")
        else:
            print(f"[DEBUG] Aucun HTML récupéré pour {domain}")

        _, cms_detail, version, theme, plugins = DomainService.detect_cms_details_from_html(domain, html)

        # Debug CMS
        print(f"[DEBUG] CMS détecté: {cms_detail}")

        ping = DomainService.get_ping(domain)
        http_status = DomainService.get_http_status(response)
        ssl_exp = DomainService.get_ssl_expiration(domain)
        creation, registrar, dns = DomainService.get_whois_details(domain)
        adress_ip = DomainService.get_ip_address(domain)
        server_location = DomainService.get_server_location(adress_ip) if adress_ip else "N/A"
        availability, response_time = DomainService.get_availability_and_response_time(domain)

        result = {
            "nom": domain,
            "en_ligne": online if online is not None else False,
            "statut": status if status else "Inconnue",
            "date_expiration": expiration.strftime('%Y-%m-%d') if expiration else None,
            "cms": cms_detail,  # Ne pas mettre None si cms_detail est une string
            "availability": availability if availability is not None else 0,
            "response_time": response_time if response_time is not None else 0,
            "cms_details": {
                "cms": cms_detail,
                "version": version if version else "-",
                "theme": theme if theme else "-",
                "plugins_detectes": plugins if isinstance(plugins, int) else 0
            },
            "whois": {
                "date_creation": creation.strftime('%Y-%m-%d') if isinstance(creation, datetime) else None,
                "registrar": registrar if registrar else "-",
                "dns": dns if dns else "-"
            },
            "network": {
                "ping": ping,
                "http_status": http_status if http_status else "Inaccessible",
                "ssl_expiration": ssl_exp,
                "adress_ip": adress_ip,
                "server_location": server_location if server_location else "N/A"
            }
        }

        print(f"[DEBUG] Résultat final pour {domain}: CMS = {result['cms']}")
        return result

    @staticmethod
    def process_domains(domains: List[str]) -> List[dict]:
        print("Processing domains: ", domains)
        with ThreadPoolExecutor(max_workers=10) as executor:
            return list(executor.map(DomainService.process_single_domain, domains))