from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from markitdown import MarkItDown
import tempfile
import os

app = FastAPI()

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

md = MarkItDown()

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Convert to markdown
    result = md.convert(tmp_path)
    os.unlink(tmp_path)  # clean up temp file

    return {"markdown": result.text_content, "filename": file.filename}