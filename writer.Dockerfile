FROM node:18

WORKDIR /usr/feedme/

COPY ./app ./app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./writer.mjs ./writer.mjs

RUN npm ci

CMD [ "node", "writer.mjs" ]
