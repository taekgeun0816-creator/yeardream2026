
import requests
from bs4 import BeautifulSoup


url = "https://www.dangjin.go.kr/cop/bbs/BBSMSTR_000000000013/selectBoardList.do"
#params = {"searchCnd": "0", "searchWrd":"청년"}

headers = {"User-Agent": "Mozilla/5.0"}

def search(keyword:str) -> list:
    params = {"searchCnd": "0", "searchWrd": keyword}
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
    except requests.RequestException:
        print("당진시청 사이트에 연결할 수 없습니다")
        return None

    print(f'상태코드: {resp.status_code}')
    print(f'인코딩: {resp.encoding}')
    print(f'실제주소: {resp.url}')

    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select('table.basic_table tbody tr')
    print("줄개수 :", len(rows))

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
keyword = "청년"
result = search(keyword)

if result == [] and " " in keyword:
    keyword = keyword.split()[0]
    result = search(keyword)

if result is None:
    pass
elif not result:
    print("검색 결과가 없습니다.")
else:
    for r in result:
        print(r)


