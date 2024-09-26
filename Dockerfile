FROM node:20.17

WORKDIR /app

ADD package.json /app/package.json

RUN npm install -g grunt-cli && npm install
