from idlelib.debugger_r import restart_subprocess_debugger

import requests
from bs4 import BeautifulSoup


url = "https://www.dangjin.go.kr/cop/bbs/BBSMSTR_000000000013/selectBoardList.do"
params = {"searchCnd": "0", "searchWrd":"청년"}
headers = {"User-Agent": "Mozilla/5.0"}

resp = requests.get(url, params=params, headers=headers, timeout=10)

print(f'상태코드: {resp.status_code}')
print(f'인코딩: {resp.encoding}')
print(f'실제주소: {resp.url}')

soup = BeautifulSoup(resp.text, "html.parser")
rows = soup.select('table.basic_table tbody tr')
print("줄개수 :", len(rows))

# tr = rows[0]
# link = tr.select_one('.list_subject a')
#
# print(link.get_text(strip=True))
# print(link['href'])
# print(tr.select_one("td.problem_name").get_text(strip=True))
# print(tr.select_one("td.date").get_text(strip=True))

result = []
for tr in rows:
    link = tr.select('.list_subject a')
    result.append({
        "title": link.get_text(strip=True),
        "ntt_id": link["href"].split("nttId=")[1],
        "dept": tr.select_one("td.problem_name").get_text(strip=True),
        "date": tr.select_one("td.date").get_text(strip=True),
    })
for r in result:
    print(r)