FROM node:14.17.1-alpine3.13

WORKDIR /usr/src/app

RUN apk add --no-cache --update git && \
    git clone https://github.com/WayneChang65/bot-api.git && \
    cd bot-api && \
    npm install


WORKDIR /usr/src/app/bot-api

EXPOSE 3333

CMD ["node", "server.js"]
