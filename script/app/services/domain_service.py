import os
import socket
import ssl
import time
import requests
import whois
import geoip2.database
from datetime import datetime
from bs4 import BeautifulSoup
from typing import List, Optional
from concurrent.futures import ThreadPoolExecutor


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
            return requests.get(f"https://{domain}", headers={"User-Agent": "Mozilla/5.0"}, timeout=7)
        except Exception:
            return None

    @staticmethod
    def detect_cms_details_from_html(domain: str, html: Optional[str]):
        if not html:
            return domain, "Inaccessible", "-", "-", "-"

        soup = BeautifulSoup(html.lower(), 'html.parser')
        cms, version, theme, plugins = "Inconnu", "-", "-", "-"

        if "wp-content" in html or "wp-includes" in html:
            cms = "WordPress"
            meta = soup.find("meta", attrs={"name": "generator"})
            version = meta["content"].split(" ")[-1] if meta and "wordpress" in meta.get("content", "").lower() else "Inconnue"
            theme = next((l["href"].split("/wp-content/themes/")[1].split("/")[0]
                          for l in soup.find_all("link", href=True)
                          if "/wp-content/themes/" in l["href"]), "-")
            plugins = str(sum(1 for t in soup.find_all(["script", "link"])
                              if "/wp-content/plugins/" in (t.get("src") or t.get("href") or "")))

        elif "index.php?option=" in html or "com_content" in html:
            cms = "Joomla"
        elif "sites/all/" in html or "drupal.js" in html:
            cms = "Drupal"
        elif "prestashop" in html or "blockcart" in html:
            cms = "PrestaShop"
        elif "mage/cookies.js" in html or "catalog/product/view" in html:
            cms = "Magento"
        elif ".myshopify.com" in html or "cdn.shopify.com" in html:
            cms = "Shopify"
        elif "static.parastorage.com" in html:
            cms = "Wix"
        elif "static.squarespace.com" in html:
            cms = "Squarespace"

        return domain, cms, version, theme, plugins

    @staticmethod
    def get_ping(domain: str) -> Optional[int]:
        try:
            start = time.time()
            requests.get(f"https://{domain}", timeout=5)
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
        expiration = DomainService.get_expiration(domain)
        online = DomainService.check_online(domain)
        status = DomainService.detect_status(expiration)
        response = DomainService.get_http_response(domain)
        html = response.text if response else None
        _, cms_detail, version, theme, plugins = DomainService.detect_cms_details_from_html(domain, html)
        ping = DomainService.get_ping(domain)
        http_status = DomainService.get_http_status(response)
        ssl_exp = DomainService.get_ssl_expiration(domain)
        creation, registrar, dns = DomainService.get_whois_details(domain)
        ip_address = DomainService.get_ip_address(domain)
        server_location = DomainService.get_server_location(ip_address) if ip_address else "N/A"
        availability, response_time = DomainService.get_availability_and_response_time(domain)

        return {
            "nom": domain,
            "en_ligne": online,
            "statut": status,
            "date_expiration": expiration.strftime('%Y-%m-%d') if expiration else None,
            "cms": cms_detail if cms_detail != "Inconnu" else None,
            "availability": availability,
            "response_time": response_time,
            "cms_details": {
                "cms": cms_detail,
                "version": version,
                "theme": theme,
                "plugins_detectes": int(plugins) if plugins.isdigit() else 0
            },
            "whois": {
                "date_creation": creation.strftime('%Y-%m-%d') if isinstance(creation, datetime) else None,
                "registrar": registrar,
                "dns": dns
            },
            "network": {
                "ping": ping,
                " ": http_status,
                "ssl_expiration": ssl_exp,
                "adress_ip": ip_address,
                "server_location": server_location,
                "availability": availability,
                "responseTime": response_time
            }
        }

    @staticmethod
    def process_domains(domains: List[str]) -> List[dict]:
        print("come here to process: ", domains)
        with ThreadPoolExecutor(max_workers=10) as executor:
            return list(executor.map(DomainService.process_single_domain, domains))
