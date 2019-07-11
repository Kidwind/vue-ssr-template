FROM node

COPY ./dist /home/app

WORKDIR /home/app
RUN yarn install

EXPOSE 3000
CMD ["yarn", "start"]
