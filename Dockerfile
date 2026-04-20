FROM node:24.1.0-alpine as BUILD

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . . 

RUN npm run build

RUN npm prune --production

FROM node:24.1.0-alpine
WORKDIR /app

COPY --from=BUILD /app/dist ./dist
COPY --from=BUILD /app/node_modules ./node_modules

CMD [ "node","dist/src/main" ]