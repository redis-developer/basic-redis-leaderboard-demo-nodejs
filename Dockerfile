FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ENV REDIS_ENDPOINT_URL $REDIS_ENDPOINT_URL
ENV REDIS_PASSWORD $REDIS_PASSWORD
ENV PORT $PORT

CMD [ "node", "api/index.js" ]


