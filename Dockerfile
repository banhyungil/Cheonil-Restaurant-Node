# 1단계: 빌드 단계
FROM node AS build

WORKDIR /app

COPY ./ ./
RUN npm install
RUN npm run build

FROM node:20-alpine

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./
COPY env ./env

# 앱 소스 추가
COPY --from=build /app/dist /usr/src/app/dist

RUN npm install --production

CMD npm run start
