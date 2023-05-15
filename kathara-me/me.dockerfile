FROM alpine:3.13
RUN apk add -U --no-cache npm git

WORKDIR /me

COPY package.json /me/package.json

RUN npm install

COPY . /me/

ENTRYPOINT ["npm", "run", "serve"]

EXPOSE 8080