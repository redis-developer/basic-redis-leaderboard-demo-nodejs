FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ARG REDIS_URL_ADDRESS

ENV REDIS_URL=$REDIS_URL_ADDRESS
ENV PORT 8080

CMD [ "node", "api/index.js" ]
