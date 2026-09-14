import logging

from langchain.agents import create_agent
from langchain_core.tracers import langchain
from langchain_ollama import ChatOllama

from tools import check_stock, check_weather, now_date

logging.basicConfig(level=logging.INFO)
langchain.debug=True

# to creat ollama model
llm = ChatOllama(model='hf.co/unsloth/Qwen3.5-2B-GGUF:Q4_K_M')

# to upload tools
tools = [check_stock,check_weather,now_date]

# system order
sys_prompt ="""
당신은 도구를 사용할 수 있는 AI 비서 입니다. 
질문에 답하기 위해서 필요하다면 도구를 활용 하세요.
[출력규칙]
1. 답변은 오직 한글로 해주세요.
2. 문장에 '실시간 데이터가 아니다.','API가 필요하다','가정된 결과다' 같은 불필요한 주의사항(note)
또는 추가설명은 붙히지 마세요.
3. 도구를 활용한 결과는 오직 결과만 깔끔하게 한국어 문장으로 정리해서 답하세요.
"""

# to creat agent
agent = create_agent(llm, tools=tools, system_prompt=sys_prompt)

def start_agent(query:str): # 프롬프트 생성 + 대답듣기
    # stream_mode = "updates"
    # stream_mode ="messages" <- 기본


    mode = 'updateds'
    for chunk in agent.stream({"messages":[("user",query)]},stream_mode=mode):
       print(chunk)
       #messages로 처리할 경우 chunk구조가 달라지므로 해당 내용으로 벼ㅑㄴ경해주어야 한다.

       if mode == 'updates' and 'model' in chunk:
           message = chunk['model']['messages'][-1].content
           #print(message, end="",flush=True)
           yield message

       if hasattr(chunk[0], "tool_calls"):
           text = chunk[0].content
                if text != '':
                    yield text
# to create prompt

# to check answer