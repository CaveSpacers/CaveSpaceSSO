FROM node:14
WORKDIR /Integration-tests
COPY ./Integration-tests ./
RUN npm install
ENTRYPOINT ["npm", "test"]