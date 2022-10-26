FROM node:16-alpine

WORKDIR C:/dockerteste/avisosBK
COPY package.json yarn.lock .babelrc

RUN yarn

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]