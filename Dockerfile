FROM node:18-alpine AS build

ENV PORT 80
ENV HOST 0.0.0.0

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