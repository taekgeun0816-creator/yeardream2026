from datetime import datetime
from langchain_core.tools import tool


@tool
def get_today() -> str:
    """오늘 날짜와 요일을 알려줍니다. '오늘', '이번주' 같은 날짜관련 질문에 사용하세요"""
    curr_date = datetime.now()
    fmt_datetime=curr_date.strftime("%Y-%m-%d")
    days = ['월','화','수','목','금','토','일']
    day = days[curr_date.weekday()]

    return f'{fmt_datetime} ({day}요일)'

@tool
def get_city_info() -> str:
    """당진시청의 주소, 대표전화, 팩스, 홈페이지 정보를 알려줍니다.
    당진시청 위치, 주소, 찾아가는 길, 전화번호, 연락처를 묻는 질문에 사용하세요."""
    return (
        "당진시청 기본 정보\n"
        "- 주소: [31773] 충청남도 당진시 시청1로 1 (수청동 1002번지)\n"
        "- 대표전화: 1522-3113\n"
        "- 팩스: (041) 350-3699\n"
        "- 홈페이지: www.dangjin.go.kr"
    )

