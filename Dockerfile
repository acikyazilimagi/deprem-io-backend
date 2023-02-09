FROM node:18-alpine

ENV PORT 80
ENV HOST 0.0.0.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]