FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 8080
CMD [ "node", "api/index.js" ]
