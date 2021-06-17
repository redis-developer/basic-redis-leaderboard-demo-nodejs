FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ARG REDIS_ENDPOINT_URI


ENV PORT 8080

CMD [ "node", "api/index.js" ]
