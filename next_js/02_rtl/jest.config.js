//next와 jest를 연동
const nextJest = require("next/jest") // js에서에 임포트문

//여기에 있는 설정 파일들을 읽어라(설정 파일들은 이 공간에 다 있다)
const createJestConfig = nextJest({dir:"./"});

const jestConfig = {
    testEnvironment:'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$':'<rootDir>/src/$1'
    },
    setupFilesAfterEnv:['<rootDir>/jest.setup.js'] // 테스트전 환경설정하는 용도

}

module.exports = createJestConfig(jestConfig);