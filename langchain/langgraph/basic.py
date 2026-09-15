# 1. 상태 저장소 등록
from langchain_ollama import ChatOllama
from pydantic import BaseModel

# 특정한 문구를 주면 다듬어주는 에이전트
class SimplState(BaseModel):
    ori_query:str =""
    refined_query:str =""
    response:str =""

llm = ChatOllama(model="gemma4:e4b", temperature=0.3,)
# 2. 노드 준비 - 특정 실행 함수(에이전트)
def refined_text_node(state:SimplState) -> SimplState:
    """ 유저의 문장을 정중하고 명확하게 다듬는 노드 """
    print('[NODE 1] 문장을 다듬는 중...')
    prompt = f'ek\\ 다음의 문장을 정중하고 명한한 형태로 다듬어줘 : {state.ori_query}'
    res = llm.invoke(prompt)
    state.refined_query = res.content.strip()
    return state

def call_llm_node(state:SimplState) -> SimplState:
    """다듬어진 문장을 바탕으로 답변을 생성하는 노드 """






# 3. 노드 조립

