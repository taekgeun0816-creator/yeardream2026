from langchain_core.prompts import ChatPromptTemplate, structured
from langchain_ollama import ChatOllama

from reviewmodel import ReviewAnalysis

model = ChatOllama(model="exaone3.5:2.4b")

#
prompt = ChatPromptTemplate.from_messages([
    ("system","당신은 리뷰 분석가 입니다. 리뷰를 분석하여 지정된 형식으로 답변하세요"),
    ("human","리뷰 : {review}")
])

structured_model = model.with_structured_output(ReviewAnalysis)

@app.get("/review/analysis")
def get_structured(review:str):
    cahin = prompt | structured_model

    result = chain.invoke({'review':review})
    print(result)
    return result.model_dump()
