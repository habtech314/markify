from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from markitdown import MarkItDown
import tempfile
import os

app = FastAPI()

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

md = MarkItDown()

class UrlRequest(BaseModel):
    url: str

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    result = md.convert(tmp_path)
    os.unlink(tmp_path)

    return {"markdown": result.text_content, "filename": file.filename}

@app.post("/convert-url")
async def convert_url(data: UrlRequest):
    result = md.convert(data.url)
    return {"markdown": result.text_content, "url": data.url}

@app.get("/health")
async def health():
    return {"status": "ok"}
