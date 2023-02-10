FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]