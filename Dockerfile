FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ENV REDIS_ENDPOINT_URL "Redis server URI"
ENV REDIS_PASSWORD "Password to the server"
ENV PORT 

CMD [ "node", "api/index.js" ]


