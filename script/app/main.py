from fastapi import FastAPI
from app.api import domains

app = FastAPI()

app.include_router(domains.router, prefix="/api")
