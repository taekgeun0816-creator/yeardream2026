import logging

from fastapi import FastAPI
from sqlalchemy import text
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

from db import get_conn

app = FastAPI()

app.mount("/view", StaticFiles(directory="view"))

#logger 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s:     [%(name)s] %(message)s - %(asctime)s)',
    datefmt='%Y-%m-%d %H:%M:%S',
)

logger = logging.getLogger(__name__)

@app.get("/")
def main():
    return RedirectResponse("/view/index.html")

@app.get("/overlay")
def overlay(id:str):
    cnt = 1
    logger.info(id)

    # connection - DB를 사용할수 있는 객체 (금고)
    conn = get_conn()
    # query 문 준비: SELECT COUNT(id) AS cnt FROM member WHERE id = 'admin'
    sql = text('SELECT COUNT(id) AS cnt FROM member WHERE id = :id')
    # query 문 실행
    result = conn.execute(sql, {'id': id}).mappings().fetchone()
    logger.info('result: ',result)
    # 결과 받기
    # 결과 보내기

    return {"use": cnt}