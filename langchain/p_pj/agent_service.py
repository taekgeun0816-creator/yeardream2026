import logging
import time

from langchain.agents import create_agent
# from langchain_core.globals import set_debug
from langchain_ollama import ChatOllama
from tools import get_today

logging.basicConfig(level=logging.INFO)
#set_debug(True)

llm = ChatOllama(
    model="qwen3:4b-instruct-2507-q4_K_M",
    temperature=0,
    reasoning=False,
    num_predict=200,
    keep_alive="5m",
    num_gpu=0 # 모델을 메모리에 계속 올려둠 (기본값은 5분 뒤 내려감)
)

sys_prompt = """
당신은 충청남도 당진시에 대해 안내하는 AI 도우미입니다.
한국어로 친절하고 간결하게 답변하세요.
모르는 내용은 지어내지 말고 '정확한 정보는 당진시청(www.dangjin.go.kr)에서 확인해 주세요'라고 안내하세요.
모든 답은 3문장 이내로 줄여서 답하세요. 
"""
tools = [get_today,]
agent = create_agent(llm, tools=tools, system_prompt=sys_prompt)

def ask(question:str) -> str:
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})

    print(type(result))  # <class 'dict'>
    print(result.keys())  # dict_keys(['messages'])
    for m in result["messages"]:
        return result ["messages"][-1].content

    return result["messages"][-1].content

if __name__ == "__main__":
    start = time.time()
    answer = ask("너에 대해 알려줘")

    print("응답", answer)
    print(f'걸린시간 :{time.time() - start:.1f}초')