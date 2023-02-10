FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM alpine
COPY --from=build /app /app
WORKDIR /app

RUN apk add --update nodejs npm
RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]