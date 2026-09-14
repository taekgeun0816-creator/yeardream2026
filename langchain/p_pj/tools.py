from datetime import datetime
from langchain_core.tools import tool
import requests
from bs4 import BeautifulSoup

url = "https://www.dangjin.go.kr/cop/bbs/BBSMSTR_000000000013/selectBoardList.do"
headers = {"User-Agent": "Mozilla/5.0"}

def fetch_notices(keyword:str) -> list:
    params = {"searchCnd": "0", "searchWrd": keyword}
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
    except requests.RequestException:
        return None
    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select('table.basic_table tbody tr')
    result = []
    for tr in rows:
        link = tr.select_one('.list_subject a')
        if link is None:
            continue
        result.append({
            "title": link.get_text(strip=True),
            "ntt_id": link["href"].split("nttId=")[1],
            "dept": tr.select_one("td.problem_name").get_text(strip=True),
            "date": tr.select_one("td.date").get_text(strip=True),
        })
    return result


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


@tool
def search_notices(keyword: str) -> str:
    """당진시청 누리집 공지사항을 제목으로 검색해 최신 글 목록을 알려줍니다.
    모집, 공고, 지원사업, 행사, 교육 같은 당진시 소식이나 공지를 묻는 질문에 사용하세요.

    keyword 규칙:
    - 띄어쓰기 없는 핵심 단어 하나만 넣으세요.
    - 여러 단어나 질문 문장을 그대로 넣으면 검색되지 않습니다.

    예시:
    - '청년 지원사업 공지 있어?' → keyword='청년'
    - '요즘 일자리 모집하는 거 있어?' → keyword='일자리'
    - '당진 축제 안내 알려줘' → keyword='축제'

    검색 결과가 없으면 비슷한 다른 단어로 한 번 더 검색하세요."""
    result = fetch_notices(keyword)

    if result == [] and " " in keyword:
        keyword = keyword.split()[0]
        result = fetch_notices(keyword)

    if result is None:
        return "당진시청에 연결 할 수 없습니다"
    elif not result:
        return (f"'{keyword}' 검색 결과가 없습니다.")
    else:
        lines = []
        for r in result[:5]:
            lines.append(f'{r["title"]} | 부서: {r["dept"]} | 등록일: {r["date"]} | 글번호: {r["ntt_id"]}')
        return "\n".join(lines)




