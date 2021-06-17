FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ENV REDIS_URL $REDIS_URL



CMD [ "node", "api/index.js" ]


