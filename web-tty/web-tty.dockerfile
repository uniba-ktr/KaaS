FROM golang AS builder
WORKDIR /go/src
RUN git clone https://github.com/wrfly/container-web-tty.git
WORKDIR /go/src/container-web-tty
RUN make

FROM alpine
RUN [ ! -e /etc/nsswitch.conf ] && echo 'hosts: files dns' > /etc/nsswitch.conf || exit 0
COPY --from=builder /go/src/container-web-tty/bin/container-web-tty /usr/bin
EXPOSE 8080
ENTRYPOINT [ "container-web-tty" ]
