#!/usr/bin/env bash


running=$(ss -tlp | grep :"${proxy_port}" | awk '{print $6}' | sed -e 's#.*pid=\([^,*]*\).*#\1#')

msgrunning="Proxy is \e[32mstarted\e[0m"
msgstopped="Proxy is \e[31mstopped\e[0m"
msginstalled="K3s successfully \e[32minstalled\e[0m"
K3S_VERSION="v1.26.7+k3s1"

proxy="http://${proxy_address}:${proxy_port}"


function proxy_start() {
  if [[ ! ${running} ]]
  then
    kubectl proxy --address="${proxy_address}" --port="${proxy_port}"  >/dev/null 2>&1 &
    printf "Proxy:\n%s\n" "${proxy}"
    echo -e "${msgrunning}"
  fi
}

function proxy_address(){
  echo "${proxy}"
}

function proxy_stop() {
  pid="${running}"
  if [[ ${pid} ]]
  then
    printf "Stopping Process with ID: %s\n" "${pid}"
    kill -9 "${pid}"
    echo -e "${msgstopped}"
  fi
}

function proxy_is_running(){
  pid="${running}"
  if [[ ${pid} ]]
  then
    echo -e "${msgrunning}"
    printf "Process has ID: %s\n" "${pid}"
    return 0
  else
    echo -e "${msgstopped}"
    return 1
  fi
}
