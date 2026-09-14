# 당진시 안내 챗봇 (개인 미니 프로젝트)

강의 개인 미니 프로젝트. 로컬 LLM 에이전트가 당진시청 정보를 안내하는 챗봇.

## 작업 방식 (반드시 지킬 것)

- **코드는 사용자가 직접 작성한다.** Claude는 작성된 코드를 읽고 **고칠 부분과 이유를 자세히 설명**한다.
- 사용자가 "고쳐줘", "바꿔줘", "추가해줘", "만들어줘"처럼 **명시적으로 요청하기 전에는 파일을 수정·생성·삭제·되돌리지 않는다.**
- "뭐가 문제지?", "이건 뭐야?" 같은 질문은 **설명 요청**이다. 대화창에서 설명과 예시 코드만 제공한다.
- 사용자는 파이썬/JS 기초를 배운 학생이다. 문법과 메서드를 **단계별로, 초보자 눈높이로** 설명한다.
- 설명에는 질문한 코드 줄을 먼저 붙여서, 사용자가 위로 스크롤하지 않아도 되게 한다.
- **모델을 호출하는 테스트는 실행 전에 사용자에게 먼저 묻는다.** (학원 PC는 메모리가 부족해 버벅임이 심했음)
- git push처럼 밖으로 나가는 작업은 확인을 받고 한다.

## 구성

| 파일 | 역할 |
|---|---|
| `main.py` | FastAPI 서버. `GET /` → `/view/index.html`, `POST /chat` → `{"answer": ...}` |
| `chat_model.py` | 요청 형식 `ChatModel(q: str)` |
| `agent_service.py` | `ChatOllama` + `create_agent`. `ask(question) -> str` |
| `tools.py` | 에이전트 도구 (`@tool`) |
| `crawl_test.py` | 당진시청 공지사항 크롤링 연습 파일 (도구로 옮기기 전 단계) |
| `view/index.html`, `view/style.css` | HTML + JS(axios CDN) 채팅 화면, 세로형 520px 레이아웃, 당진시 로고 |

- 실행: `p_pj` 폴더에서 `uvicorn main:app --reload` → `http://127.0.0.1:8000`
- DB 없음. Next.js는 사양 때문에 쓰지 않고 HTML+JS로 결정.
- `ask()` 함수 모양을 유지하면 `main.py`와 프론트는 고칠 필요 없음.

## 모델

- `qwen3:4b-instruct-2507-q4_K_M` (Ollama), 설정: `temperature=0`, `reasoning=False`, `num_predict=200`, `keep_alive="5m"`, `num_gpu=0`
- 2026-09-14 학원 PC 비교 테스트 결과 선택 (도구 호출 3/3 정확, 한국어 무난)
  - `Qwen3.5-2B`(unsloth GGUF): 같은 말 반복 루프 → 탈락
  - `EXAONE-4.0-1.2B`: 빠르지만 "당진시는 경기도" 등 사실 오류, 도구 호출 1/3 → 탈락
  - `exaone3.5:2.4b`: tools 미지원 → 탈락
- 작은 모델은 지역 정보를 지어냄 (시청 주소 오답 등) → **정확한 정보는 도구로 넣는다**

## 학원 PC 환경 메모

- RAM 7.4GB, GPU GTX 760(2GB). **GPU 일부 사용 중 `ggml_vulkan: device lost` → Ollama 500 오류** → `num_gpu=0`(CPU 전용)으로 해결
- 도구 목록이 붙은 첫 호출은 CPU에서 수 분 걸림(273초 측정). 두 번째부터 빠름 → 발표 전 워밍업 필요
- 집 PC가 최신 NVIDIA GPU·RAM 16GB 이상이면 `num_gpu=0`을 지우고 속도 확인해 볼 것

## 집 PC 처음 설정

1. `git pull` (또는 clone)
2. `langchain/p_pj`에서 `python -m venv .venv` → `.\.venv\Scripts\Activate.ps1` → `pip install -r requirements.txt`
3. `ollama pull qwen3:4b-instruct-2507-q4_K_M`
4. PyCharm 인터프리터를 `p_pj\.venv\Scripts\python.exe`로 지정

## 진행 상황 (2026-09-14 기준)

### 완료
- 서버, 모델, 프론트(스타일, 로고, 오류 처리) 동작 확인
- 에이전트 전환: `create_agent(llm, tools=tools, system_prompt=sys_prompt)`, 결과는 `result["messages"][-1].content`
- 도구 1 `get_today`: `"2026-09-14 (월요일)"` 형식 반환 (날짜만 주면 모델이 요일을 틀렸음)
- 도구 2 `get_city_info`: `tools.py`에 작성 완료 (당진시청 누리집 하단에서 확인한 정적 정보)

### 남은 정리 (사용자에게 알려줄 것)
- `agent_service.py`: `get_city_info`를 **아직 import·`tools` 리스트에 등록하지 않음**
- `agent_service.py` `ask()`: 확인용 `print`와 불필요한 `for` 루프 남아 있음 → 마지막 `return`만 남기면 됨
- `agent_service.py` 테스트 질문이 `"너에 대해 알려줘"` → 도구를 쓰는 질문으로 바꿔서 테스트
- `requirements.txt`에 `requests` 명시 필요 (현재 langchain 의존성으로 우연히 설치됨)

### 진행 중: 도구 3 `search_notices` (크롤링 7단계 학습)

사용자가 크롤링 분석 과정을 직접 배우며 진행 중. 1~5단계 완료, **6단계 ④에서 멈춤.**

| 단계 | 상태 | 결과 |
|---|---|---|
| 1 크롤링 허용 확인 | ✅ | robots.txt: 공지사항(`BBSMSTR_000000000013`) 허용. 자유게시판 `...004`, 홍보게시판 `...005`는 금지 |
| 2 정적/동적 확인 | ✅ | `Ctrl+U` 소스에 제목 있음 → 정적, requests 가능 |
| 3 URL 규칙 | ✅ | 사이트는 POST form이지만 GET도 동작. `searchCnd`(0 제목/1 글내용/2 부서명), `searchWrd`, `pageIndex` |
| 4 HTML 구조 | ✅ | 아래 선택자 |
| 5 콘솔 검증 | ✅ | `console.table`로 10건 정상 확인 |
| 6 파이썬으로 옮기기 | ⏸️ ①②③ 완료, **④ 진행 중** | |
| 7 예외 상황 | ⬜ | |

- 검색 주소: `https://www.dangjin.go.kr/cop/bbs/BBSMSTR_000000000013/selectBoardList.do?searchCnd=0&searchWrd=청년`
- 선택자
  - 줄(글 하나): `table.basic_table tbody tr`
  - 제목·링크: `.list_subject a` (한 줄에 첨부파일 `<a>`도 있어서 `tr a`는 안 됨)
  - 글번호: 링크 `href`의 `nttId=` 뒤 (예: `1132807`)
  - 부서: `td.problem_name`, 등록일: `td.date`
- 한 페이지 10건, 최신순. 결과 없으면 `tr` 하나에 "검색 결과가 없습니다."만 있고 `<a>` 없음
- **함정: 띄어쓰기 있는 검색어(`청년 지원사업`)는 0건.** 모델이 여러 단어를 넣는 경향 → docstring에 단어 하나만 넣으라고 쓰고, 0건이면 첫 단어로 재검색

`crawl_test.py`에서 다음에 알려줄 것:
- 31번째 줄 `tr.select(...)` → `tr.select_one(...)` (select는 리스트, select_one은 요소 하나)
- 1번째 줄 `from idlelib.debugger_r import restart_subprocess_debugger`는 PyCharm 자동 import로 들어간 불필요한 줄

### 다음 할 일
1. `crawl_test.py` 6단계 ④ 완료 (dict 10개 출력)
2. 7단계: 결과 없음, 띄어쓰기 검색어, 연결 실패(`requests.RequestException` → 오류 대신 안내 문자열 반환)
3. `tools.py`에 `search_notices(keyword: str)`로 옮기기 (결과 최대 5개, `제목 | 부서 | 등록일 | 글번호` 형식), 에이전트에 등록
4. 도구 4 `get_article(ntt_id)`: 상세 페이지 `selectBoardArticle.do?nttId=...` — 사용자가 같은 7단계로 직접 분석해 보는 연습 문제로 제안함. 본문은 800자 정도로 자르기
5. 발표 준비: 서버 시작 시 도구를 쓰는 질문으로 워밍업, "모델만 쓸 때 틀린 답 vs 도구 붙인 뒤 정확한 답" 비교

## 사용자가 자주 겪은 실수 (설명할 때 참고)

- PyCharm 자동 import가 엉뚱한 모듈을 가져옴: `from datetime import time`, `from json import tool`, `from langchain_core.tracers import langchain`
- 자기 자신 import (`import agent_service as llm`)
- `=`/`==`, `import time` vs `from time import time` 짝 맞추기
- `select` vs `select_one`, 딕셔너리 `{'a': b}` vs 세트 `{'a', b}`
- 주석 처리로 `for` 블록이 비어 `IndentationError`
- 가상환경이 안 켜진 채 실행해 `ModuleNotFoundError`
