FROM docker

RUN apk add --no-cache python3 py3-pip tmux iptables bash && \
    apk add --no-cache --virtual .build-deps py3-wheel alpine-sdk python3-dev && \
    git clone -b master --single-branch --depth=1 https://github.com/saghul/pyuv && \
    cd pyuv && \
    python3 setup.py install && \
    cd / && \
    pip install kathara libtmux && \
    apk del .build-deps && \
    rm -rf pyuv

ADD kathara /usr/bin/
ADD kathara.conf /root/.config/kathara.conf

RUN chmod +x /usr/bin/kathara

# need to set tmux as default terminal. tests needed!
# remove at some pint   ping -c 1 github.com 2>&1 || echo "Ping failed" &&
