FROM node:14
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY Integration-tests/ ./Integration-tests/test/

CMD ["sh", "-c", "run-app-test-local"]