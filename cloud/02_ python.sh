# 1. python 설치 
sudo yum install -y python3.14 python3.14-pip
python --version / python 3.14 -v

#권한 d = directory / - = file, r = read, w = write, e = excute
#  소유자, 그룹, 누구나
# d rwx,  rwx,  rwx

# 디렉토리 생성
makedirectory = mkdir [폴더명] / mkdir app
# 생성된 디렉토리로 들어가기
cd app
# 3. 가상환경 생성 및 실행 
python3.14 -m venv venv
source venv/bin/activate

# pip 업그레이드 / uv 설치
pip install --upgrade pip
pip install uv

#requirements.txt 생성및 수정
vim requirements.txt # -> i는 글쓰기, o는 한칸띄고 글쓰기 :q! 나가기 :wq는 저장 후 나가기
cat requirement.txt 

#라이브러리 설치
uv pip install -r requirements.txt

#실행
uvicorn main:app --host=0.0.0.0 --port 8000 --workers 2

# 멈추지 않고 실행하는 방법 -> 최종적으로 서비스 구동할 때 사용해야함 
# nohup : 종료되지 않고 계속 실행될수 있게 해준다.  
# > uvicorn.log 실행 내용을 uvicorn.log로 남기겠다. 
# 2>&1 : 2는 에러로그 1은 표준출력로그 -> 에러로그도 표준출력 로그처럼 출력해라 \
# 2>1로 하면 에러로그를 파일명 1에 저장하라고 오해할 수 있어 특수문자 &를 붙임
# & : 백그라운도 실행하라 -> 내 UI 가리지마 
nohup uvicorn main:app --host=0.0.0.0 --port 8000 --workers 2 > uvicorn.log 2>&1 &

#로그 확인방법
#실시간
tail -f uvicorn.log
#일기
cat uvicorn.log
vim uviconr.log

# 5. 끄기
# 8000번 누가 사용하고 있는지?
# lsof : list open file -> 리스트에 있는거 다 열어
# -i : Internet
# :8000 -> :8000 이라는 문자가 나오는 거  
sudo lsof -i :8000

# 해당 프로세스 종료
kill -9 [pid]


# 가상환경 종료
deactivate

# main.py 파일 삭제
rm -rf main.py
rm -rf [파일명]