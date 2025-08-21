from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import requests
from app.api import domains
from app.services.domain_service import DomainService

app = FastAPI()
app.include_router(domains.router, prefix="/api")

# Endpoints Laravel
LARAVEL_API_GET_DOMAINS = "http://localhost:8000/api/domaines"
LARAVEL_API_UPDATE_SCAN = "http://localhost:8000/api/domaines/{id}/update-scan"


def get_domains_from_laravel():
    """Récupère la liste des domaines depuis Laravel"""
    try:
        response = requests.get(LARAVEL_API_GET_DOMAINS, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Erreur récupération domaines Laravel: {e}")
        return []


def update_domain_scan(domain_id, scan_data: dict):
    """Envoie le résultat complet de l'analyse à Laravel pour mise à jour"""
    try:
        url = LARAVEL_API_UPDATE_SCAN.format(id=domain_id)

        # Vérification que les données existent
        cms_details = scan_data.get("cms_details", {})
        whois = scan_data.get("whois", {})
        network = scan_data.get("network", {})

        payload = {
            "last_scan_at": datetime.now().isoformat(),

            # Champs principaux
            "nom": scan_data.get("nom"),
            "en_ligne": scan_data.get("en_ligne", False),
            "statut": scan_data.get("statut"),
            "date_expiration": scan_data.get("date_expiration"),
            "cms": scan_data.get("cms"),
            "availability": scan_data.get("availability", 0),
            "response_time": scan_data.get("response_time", 0),

            # Aplatir les données CMS
            "cms_details": {
                "cms": cms_details.get("cms"),
                "version": cms_details.get("version", "-"),
                "theme": cms_details.get("theme", "-"),
                "plugins_detectes": cms_details.get("plugins_detectes", 0),
            },

            # Aplatir les données WHOIS
            "whois": {
                "date_creation": whois.get("date_creation"),
                "registrar": whois.get("registrar", "-"),
                "dns": whois.get("dns", "-"),
            },

            # Aplatir les données réseau
            "network": {
                "ping": network.get("ping"),
                "http_status": network.get("http_status", "Inaccessible"),
                "ssl_expiration": network.get("ssl_expiration"),
                "adress_ip": network.get("adress_ip"),
                "server_location": network.get("server_location", "N/A"),
            }
        }

        # Debug : afficher le payload
        print(f"[DEBUG] Payload pour domaine {domain_id}:")
        print(payload)

        response = requests.post(url, json=payload, timeout=15)

        # Debug : afficher la réponse
        print(f"[DEBUG] Réponse Laravel: {response.status_code}")
        print(f"[DEBUG] Contenu: {response.text}")

        if response.status_code == 200:
            print(f"[OK] Domaine {domain_id} mis à jour")
        else:
            print(f"[ERREUR] Update domaine {domain_id}: {response.status_code} {response.text}")

    except Exception as e:
        print(f"[EXCEPTION] Erreur update domaine {domain_id} : {e}")

def monitoring_job():
    """Analyse tous les domaines et envoie les résultats à Laravel"""
    try:
        print(f"[{datetime.now()}] Démarrage du monitoring")
        domains_list = get_domains_from_laravel()
        if not domains_list:
            print("Aucun domaine récupéré")
            return

        noms = [d['nom'] for d in domains_list]
        results = DomainService.process_domains(noms)

        for domain_obj, result in zip(domains_list, results):
            print(f"Scan de {domain_obj['nom']}: statut {result['statut']}")
            update_domain_scan(domain_obj['id'], result)

    except Exception as e:
        print(f"Erreur dans monitoring_job: {e}")


# Scheduler
scheduler = BackgroundScheduler()


@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(monitoring_job, "interval", seconds=43200)  # toutes les 12h
    scheduler.start()
    print("Scheduler démarré")


# Endpoint manuel pour lancer le monitoring
@app.post("/run-monitoring")
def run_monitoring():
    monitoring_job()
    return {"message": "Monitoring lancé manuellement"}


# Endpoint racine
@app.get("/")
def home():
    return {"message": "Service de monitoring actif"}
