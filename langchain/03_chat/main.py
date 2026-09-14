from langchain_core.messages import AIMessage, HumanMessage
from langchain_ollama import ChatOllama
from langchain_core.prompts import MessagesPlaceholder, ChatPromptTemplate

#모델 호출
model = ChatOllama(model='exaone3.5:2.4b')

conversation_history = []

#프롬프트 작업
prompt = ChatPromptTemplate([
    ("system","당신은 답변 전문 AI 모델 입니다. 주어진 질문에 대해서 핵심만 간단히 대답하세요"),
    MessagesPlaceholder(variable_name="history"), # 대화내용을 history라는 이름으로 줄게
    ("user","{query}")
])

#파이프라인 조립


chain = prompt|model

#실행 및 출력


while True:
    query = input('\n당신> ').strip() # 앞뒤 공백 제거 (스페이스만 친 경우도 빈 입력 처리)

    if query == '/exit' or query == '/bye':
        print('대화를 종료 합니다')
        break

    if not query: # 빈 입력이면 LLM 호출하지 말고 다시 입력받기
        continue

    answer = ''
    print('AI> ', end='', flush=True) # 누가 말하는지 표시
    for chunk in chain.stream({'query': query,"history":conversation_history}):
        print(chunk.content,end='',flush=True) # StrOutputParser() 안써서. content 붙히는 것
        answer += chunk.content

    conversation_history.append(HumanMessage(content=query))
    conversation_history.append(AIMessage(content=answer))
    print()
    print(f'[history length] : {len(conversation_history)}')