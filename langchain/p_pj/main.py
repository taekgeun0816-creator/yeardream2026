from fastapi import FastAPI
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

from agent_service import ask
from chat_model import ChatModel

app = FastAPI()
app.mount("/view", StaticFiles(directory="view"))


@app.get("/")
def index():
    return RedirectResponse("/view/index.html")

@app.post('/chat')
def chat(param: ChatModel):
    answer = ask(param.q)
    return {'answer': answer}
