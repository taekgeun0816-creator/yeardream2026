"""from typing import List

import uvicorn
from fastapi import FastAPI, UploadFile
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

app = FastAPI()
app.mount("/view", StaticFiles(directory="view"))

@app.get("/")
def index():
    return RedirectResponse(url="/view/upload.html")

@app.post("/upload"):
def upload(files : List[UploadFile]):
    msg = "파일업로드에 실패했습니다."
"""
import os.path

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

IMAG_PATH ='./upload'

app = FastAPI()
app.mount("/view", StaticFiles(directory="view"))

if not os.path.exists(IMAG_PATH):
    os.makedirs(IMAG_PATH)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

@app.get("/")