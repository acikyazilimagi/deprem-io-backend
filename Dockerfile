FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

FROM alpine
COPY --from=build /app /app
WORKDIR /app

RUN apk add --update nodejs npm
RUN apk add --no-cache tini
RUN apk add --no-cache bash

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["./wait-for-it.sh" , "mongodb:27017" , "--strict" , "--timeout=30" , "--" , "node", "index.js"]