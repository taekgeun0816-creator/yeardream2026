from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def main():
    pass

@app.post("/ask/chat/")
def ask_chat():
