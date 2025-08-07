import os
import whois
import socket
import requests
import time
import ssl
from datetime import datetime
from bs4 import BeautifulSoup
import geoip2.database

# === Chemin absolu vers le fichier GeoLite2 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GEOIP_PATH = os.path.join(BASE_DIR, 'data', 'GeoLite2-City.mmdb')

if not os.path.exists(GEOIP_PATH):
    raise FileNotFoundError(f"❌ Le fichier GeoLite2 est introuvable à : {GEOIP_PATH}")

geoip_reader = geoip2.database.Reader(GEOIP_PATH)

# === Liste des domaines à analyser ===
tableau_domaine = ["fifa.com"]

# === Fonctions utilitaires ===
def get_expiration(domain):
    try:
        info = whois.whois(domain)
        exp = info.expiration_date
        return exp[0] if isinstance(exp, list) else exp
    except Exception:
        return None

def check_online(domain):
    try:
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False

def detect_status(exp):
    if exp is None:
        return "Inconnue"
    now = datetime.now()
    if exp < now:
        return "Expiré"
    elif (exp - now).days <= 15:
        return "Bientôt"
    else:
        return "Valide"

def get_http_response(domain):
    try:
        return requests.get(f"https://{domain}", headers={"User-Agent": "Mozilla/5.0"}, timeout=7)
    except Exception:
        return None

def detect_cms_details_from_html(domain, html):
    if not html:
        return domain, "Inaccessible", "-", "-", "-"

    soup = BeautifulSoup(html.lower(), 'html.parser')
    cms, version, theme, plugins = "Inconnu", "-", "-", "-"

    if "wp-content" in html or "wp-includes" in html:
        cms = "WordPress"
        meta = soup.find("meta", attrs={"name": "generator"})
        version = meta["content"].split(" ")[-1] if meta and "wordpress" in meta.get("content", "") else "Inconnue"
        theme = next((l["href"].split("/wp-content/themes/")[1].split("/")[0] for l in soup.find_all("link", href=True) if "/wp-content/themes/" in l["href"]), "-")
        plugins = str(sum(1 for t in soup.find_all(["script", "link"]) if "/wp-content/plugins/" in (t.get("src") or t.get("href") or "")))

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

def get_ping(domain):
    try:
        start = time.time()
        requests.get(f"https://{domain}", timeout=5)
        return int((time.time() - start) * 1000)
    except Exception:
        return None

def get_http_status(response):
    return f"{response.status_code} {response.reason}" if response else "Inaccessible"

def get_ssl_expiration(domain):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                expire_date = datetime.strptime(ssock.getpeercert()['notAfter'], '%b %d %H:%M:%S %Y %Z')
                return expire_date.strftime('%Y-%m-%d')
    except Exception:
        return None

def get_whois_details(domain):
    try:
        info = whois.whois(domain)
        creation = info.creation_date
        return creation[0] if isinstance(creation, list) else creation, info.registrar, ", ".join(info.name_servers) if isinstance(info.name_servers, list) else info.name_servers
    except:
        return None, None, None

def get_ip_address(domain):
    try:
        return socket.gethostbyname(domain)
    except Exception:
        return None

def get_server_location(ip):
    try:
        resp = geoip_reader.city(ip)
        return ', '.join(filter(None, [resp.city.name, resp.subdivisions.most_specific.name, resp.country.name]))
    except Exception:
        return "N/A"

def get_availability_and_response_time(domain):
    try:
        start = time.time()
        response = requests.get(f"https://{domain}", timeout=5)
        response_time = int((time.time() - start) * 1000)
        availability = 100 if response.status_code == 200 else 0
        return availability, response_time
    except Exception:
        return 0, 0

def envoyer_donnees_a_laravel(data):
    try:
        response = requests.post('http://127.0.0.1:8000/api/domaines/store-full', json=data, headers={"Content-Type": "application/json"}, timeout=10)
        if response.status_code in (200, 201):
            print(f"✅ Envoyé : {data['nom']} ➜ Status {response.status_code}")
        else:
            print(f"⚠️ Erreur Laravel pour {data['nom']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erreur d'envoi pour {data['nom']}: {e}")

# === Analyse des domaines ===
for domain in tableau_domaine:
    print(f"\n🔎 Analyse de {domain}...")
    expiration = get_expiration(domain)
    online = check_online(domain)
    status = detect_status(expiration)
    response = get_http_response(domain)
    html = response.text if response else None
    _, cms_detail, version, theme, plugins = detect_cms_details_from_html(domain, html)
    ping = get_ping(domain)
    http_status = get_http_status(response)
    ssl_exp = get_ssl_expiration(domain)
    creation, registrar, dns = get_whois_details(domain)
    ip_address = get_ip_address(domain)
    server_location = get_server_location(ip_address) if ip_address else "N/A"
    availability, response_time = get_availability_and_response_time(domain)

    data = {
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
            "http_status": http_status,
            "ssl_expiration": ssl_exp,
            "adress_ip": ip_address,
            "server_location": server_location,
            "availability": availability,
            "responseTime": response_time
        }
    }

    envoyer_donnees_a_laravel(data)

geoip_reader.close()
