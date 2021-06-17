FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

ARG REDIS_ENDPOINT_URI


ARG PORT 

CMD [ "node", "api/index.js" ]
