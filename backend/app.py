# uvicorn app:app --reload --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from extract import extract_entities

app = FastAPI(title="CrimeGraph-AI Entity Extractor")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

@app.post("/extract")
def extract(payload: TextPayload):
    entities = extract_entities(payload.text)
    return entities
