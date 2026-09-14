# uv pip install uvicorn fastapi
# uvicorn main:app --reload
from time import time
from fastapi import FastAPI
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

app = FastAPI()

# /view라는 주소로 들어오면
app.mount('/view',StaticFiles(directory='view'))

@app.get('/')
def main() :
    return RedirectResponse("/view/index.html")

@app.get("/calc")
def calc(val1:int,oper:str,val2:int):
    print(f'{val1}{oper}{val2} =?')
    time.sleep(5)
    result = 0
    if oper == '+':
        result = val1 + val2
    elif oper == '-':
        result = val1 - val2
    elif oper == '*':
        result = val1 * val2
    else:
        if val2 == 0:
            return {'message': '0으로 나눌 수 없습니다.'}
        else:
            result = val1 / val2

    return {"result":result}
