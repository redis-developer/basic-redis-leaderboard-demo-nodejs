FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ENV REDIS_ENDPOINT_URI $REDIS_ENDPOINT_URI
ENV REDIS_PASSWORD $REDIS_PASSWORD



CMD [ "node", "api/index.js" ]


