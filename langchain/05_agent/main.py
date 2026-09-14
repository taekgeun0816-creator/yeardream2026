from typing import Dict

from fastapi import FastAPI
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles
from agent_service import agent_func

app = FastAPI()
app.mount("/view", StaticFiles(directory="view"))

@app.get("/")
def main():
    return RedirectResponse(url="/view/index.html")

@app.post("/calc")
def calc(info:Dict[str,str]):
    print(info)
    return"test"