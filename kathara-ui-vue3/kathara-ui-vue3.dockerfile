FROM alpine:3.13
RUN apk add -U --no-cache npm git

WORKDIR /vue3

COPY package.json /vue3/package.json

RUN npm install

COPY . /vue3/

RUN npm run build

ENTRYPOINT ["npx", "vite", "--host", "0.0.0.0", "--port", "8080", "--mode", "staging"]

EXPOSE 8080