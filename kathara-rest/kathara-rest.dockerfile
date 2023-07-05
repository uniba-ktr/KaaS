FROM docker:19

COPY requirements.txt /requirements.txt

RUN apk add --no-cache python3 py3-pip tmux iptables bash patch && \
    apk add --no-cache --virtual .build-deps py3-wheel alpine-sdk python3-dev && \
    ping -c 1 github.com 2>&1 || echo "Ping failed" && \
    git clone -b master --single-branch --depth=1 https://github.com/saghul/pyuv && \
    cd pyuv && \
    python3 setup.py install && \
    cd /

RUN pip install --no-deps -r requirements.txt && \
    pip install -r requirements.txt && \
    apk del .build-deps && \
    rm -rf pyuv

COPY res/ /kathara-rest/res
COPY src/ /kathara-rest/src

# TODO Proposal to Kathara to include container ID in dict
#COPY DockerMachineStats.py /usr/lib/python3.8/site-packages/Kathara/manager/docker/stats/

ENV PYTHONPATH="/kathara-rest/"

WORKDIR /kathara-rest/src

# For debug purposes symlink kathara
ADD kathara /usr/bin/
ADD kathara.conf /root/.config/kathara.conf

RUN chmod +x /kathara-rest/res/patch.sh && \
    /bin/bash -c /kathara-rest/res/patch.sh && \
    chmod +x /usr/bin/kathara && \
    pip install libtmux

#uvicorn --reload --host $HOST --port $PORT --log-level $LOG_LEVEL "$APP_MODULE"
# https://github.com/tiangolo/uvicorn-gunicorn-docker
CMD ["uvicorn", "--reload", "--host", "0.0.0.0", "--port", "8000", "rest:app"]

#ADD kathara /usr/bin/
#ADD kathara.conf /root/.config/kathara.conf

#RUN chmod +x /usr/bin/kathara

# need to set tmux as default terminal. tests needed!
# remove at some pint   ping -c 1 github.com 2>&1 || echo "Ping failed" &&
