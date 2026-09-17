# 올라마 설치
curl -fsSL https://ollama.com/install.sh | sh

#설치 확인
sudo systemctl status ollama

#모델 설치
ollama run gemma4:e2b 
# /bye로 종료후...

# 사용 ip 확인
sudo lsof -i :11434
# localhost:11434(LISTEN)

#다른 ip 에서 사용할 수 있도록 개방 
sudo systemctl edit ollama.service
[Service]
Evironment="OLLAMA_HOST=0.0.0.0" 

#Ctrl + O -> Enter(저장) -> Ctrl + X (종료)

sudo systemctl daemon-reload
sudo systemctl restart ollama

#가상환경 설정
#생성
python3.14 -m venv .venv
#실행
source venv/bin/activate

# requirement.txt 설치
pip install --upgrade pip
pip install uv
uv pip install -r requirements.txt

서버시작
uviconr main:app --host=0.0.0.0 port=8000

#종료
#^ + c
deactivate #가상화종료
cd ../       # 한 단계 위 폴더로 이동
rm -rf app # app 폴더 삭제