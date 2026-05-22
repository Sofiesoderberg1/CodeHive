FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["node", "server.js"] 