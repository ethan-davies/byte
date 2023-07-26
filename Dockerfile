FROM node:lts

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV PORT=3000
ENV DOCKER=true

EXPOSE 3000

CMD ["npm", "start"]
