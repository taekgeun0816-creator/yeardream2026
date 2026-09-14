import logging

import langchain
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from tools import multiply, minus, add, divide

#추론과정 확인
logging.basicConfig(level=logging.INFO)
langchain.debug = True

# 모델 불러오기
def agent_func():
    model_id = 'gemma4:e2b'
    model = ChatOllama(model=model_id, temperature=0)
    # 도구등록
    tools= [add, minus, multiply, divide]
    #.에이전트 생성
    agent = create_agent(model = model, tools = tools)
    # 프롬프트제작
    #3+3 은?
    #a=5, b=10 일 경우 a+b를 계산해줘
    msg = input('사칙 연산을 해보세요 예)3+3')
    prompt = ChatPromptTemplate.from_messages([
        ("system" , "당신은 사칙연산 전문가 입니다. 값 a와 값b, 연산자가 주어지면 연산 후 답을 반환하는 작업을 수행하세요"),
        ("user", "{message}")
    ])

    # 파이프라인 조합
    chain = prompt|agent

    # 실행
    resp = chain.invoke({"message":msg})

    print('---AI 생각 과정 및 도구 실행 모니터링---')

    for i, message in enumerate(resp['messages']):
        print(f'[STEP]{i}     {message}')
