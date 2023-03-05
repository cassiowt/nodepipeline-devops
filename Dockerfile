FROM node:12
RUN sudo apt-get update && apt-get install git -y && apt-get install imagemagick -y;

WORKDIR /ecs-app

COPY package*.json ./
COPY controller controller
COPY server.js server.js

RUN npm install
RUN chown -R node:node /ecs-app

ENV NODE_ENV=production
ENV ENV_ECS=true
USER node
EXPOSE 80

ENTRYPOINT ["sudo", "npm", "start"]