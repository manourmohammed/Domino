# app/models/dto.py

from pydantic import BaseModel
from typing import List, Optional


class WhoisResult(BaseModel):
    online: Optional[bool] = None   # en_ligne
    status: Optional[str] = None    # statut
    expiration: Optional[str] = None  # date_expiration
    availability: Optional[float] = None
    response_time: Optional[float] = None
    cms_simple: Optional[str] = None  # cms


class CmsResult(BaseModel):
    cms: Optional[str] = None
    version: Optional[str] = None
    theme: Optional[str] = None
    plugins_detectes: Optional[int] = None


class ReseauResult(BaseModel):
    ping: Optional[str] = None
    http_status: Optional[int] = None
    ssl_expiration: Optional[str] = None
    adress_ip: Optional[str] = None
    server_location: Optional[str] = None


class WhoisDetailsResult(BaseModel):
    date_creation: Optional[str] = None
    registrar: Optional[str] = None
    dns: Optional[str] = None


class DomainGroupedResult(BaseModel):
    nom: str
    en_ligne: Optional[bool] = None
    statut: Optional[str] = None
    date_expiration: Optional[str] = None
    availability: Optional[float] = None
    response_time: Optional[float] = None
    cms: Optional[str] = None
    cms_details: Optional[CmsResult] = None
    whois: Optional[WhoisDetailsResult] = None
    network: Optional[ReseauResult] = None


class DomainResponse(BaseModel):
    results: List[DomainGroupedResult]
