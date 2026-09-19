SELECT * FROM mysql.user;

# 주석
-- 주석(대표주석)

#  database 확인
SHOW databases;

# CREATE 로 만든 녀석은 대부분 DROP 으로 삭제되고 ALTER 로 수정된다.
-- CREATE DATABASE [name]; <- creawte
-- DROP DATABSE [name]; <- delete 
-- USE [database name]; <- use(enter)

-- mydb 라는 database 만들기, 그리고 사용

CREATE DATABASE mydb;
USE mydb;

-- table 확인
SHOW tables;

-- table 생성
/*
 CREATE TABLE [테이블명] (
 	[컬럼명][데이터타입](사이즈),
 	...
 );
 */
/*
  1) 문자타입
  - 고정형 CHAR(바이트)
  - 가변형 VARCHAR(바이트) -> 바이트 크기만큼 자리잡았다가 데이터가 작으면 줄어든다. 
  - TEXT: 65MB 
  - LONGTEXT: 4GM
  2) 숫자타입
  - INT, FLOAT, BIGINT, DOUBLE
  3) BOOLEAN -> 1,0
  4) 날짜타입
  - DATE		: 0000-00-00
  - DATETYIME	: 0000-00-00 00:00:00.000
  - TIMESTAMPT	: DATETIME 과 같지만 time-zone에 따라 시간이 변경된다.   
*/

CREATE TABLE test_table(
	user_name VARCHAR(40),
	age INT(3),
	mobile VARCHAR(20),
	reg_date DATE DEFAULT CURDATE()
);

SHOW tables;

-- 테이블 구조확인
DESC test_table;

CREATE TABLE employees(
	emp_nom INT(3),
	firts_name varchar(8),
	last_name varchar(2),
	email VARCHAR(50),
	mobile VARCHAR(11),
	salary INT(8),
	reg_date DATE DEFAULT CURDATE()
);

SHOW tables;

DROP TABLE test_table;

-- 테이블 수정
-- 1) 컬럼이름 수정
-- ALTER TABLE [table_name] RENAME COLUMN [변경전 이름] TO [변경후 이름]
ALTER TABLE employees RENAME COLUMN last_name TO family_name;
DESC employees;

-- 2) 컬럼 추가
-- ALTER TABLE [테이블이름] ADD ([컬럼명][데이터타입](사이즈))
ALTER TABLE employees ADD (depart_no VARCHAR(10));
ALTER TABLE employees ADD (commission VARCHAR(10));
ALTER TABLE employees ADD (etc VARCHAR(100));

-- 3) 컬럼 속성 변경
-- ALTER TABLE [테이블이름] MODIFY COLUMN [컬럼명] [데이터타입](사이즈)
-- 00.00 의 경우 FLOAT(전체자리수, 소수점자리수)
ALTER TABLE employees MODIFY COLUMN commission FLOAT(4,2);
DESC employees;

-- 4) 컬럼 삭제
-- ALTER TABLE [테이블명] DROP COLUMN [컬럼명];
-- etc 컬럼 삭제 
ALTER TABLE employees DROP COLUMN etc;


