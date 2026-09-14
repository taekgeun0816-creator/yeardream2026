# uv pip install uvicorn fastapi
# uvicorn main:app --reload

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def main():
    return {"mag": "main page"}

# /items?skip=10&limit=10
@app.get("/items")
def read_name(skip:int, limit:int):
    return {"skip": skip, "limit": limit}

#/items/id/1033As

@app.get("/items/id/{item_id}")
def read_id(item_id:str):
    return {"item_id": item_id}