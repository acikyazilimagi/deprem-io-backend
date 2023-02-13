FROM node:18-alpine AS build

RUN apk add --no-cache tini

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts --omit=dev

COPY . .

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]
