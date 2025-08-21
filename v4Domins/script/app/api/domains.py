from typing import List
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.services.domain_service import DomainService


router = APIRouter()

class DomainListRequest(BaseModel):
    domains: List[str]

@router.post("/domains/check")
async def check_domains(request: DomainListRequest):
    results = DomainService.process_domains(request.domains)
    return JSONResponse(content={"results": results})