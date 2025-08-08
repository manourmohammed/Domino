# app/models/dto.py

from pydantic import BaseModel
from typing import List


class WhoisResult(BaseModel):
    online: str
    status: str
    expiration: str
    cms_simple: str


class CmsResult(BaseModel):
    cms_detail: str
    version: str
    theme: str
    plugins: str


class ReseauResult(BaseModel):
    ping: str
    http_status: str
    ssl_expiration: str


class WhoisDetailsResult(BaseModel):
    creation: str
    registrar: str
    dns: str


class DomainGroupedResult(BaseModel):
    domain: str
    whois: WhoisResult
    cms: CmsResult
    network: ReseauResult
    whois_details: WhoisDetailsResult


class DomainResponse(BaseModel):
    results: List[DomainGroupedResult]
