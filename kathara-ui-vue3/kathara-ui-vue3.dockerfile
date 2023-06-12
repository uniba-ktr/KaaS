FROM alpine:3.13
RUN apk add -U --no-cache npm git

WORKDIR /vue3

COPY package.json /vue3/package.json

RUN npm install

COPY . /vue3/

ENTRYPOINT ["npm", "run", "dev", "--", "--host"]

EXPOSE 8080