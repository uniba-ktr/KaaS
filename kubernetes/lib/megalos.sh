#!/usr/bin/env bash
#source proxy.sh

megalos_yml="https://raw.githubusercontent.com/KatharaFramework/Megalos-CNI/master/kathara-daemonset.yml"
multus_yml="https://raw.githubusercontent.com/k8snetworkplumbingwg/multus-cni/v4.0.2/deployments/multus-daemonset-thick.yml"
flannel_yml="https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml"
kathara_config="${HOME}/.config/kathara.conf"


function start_megalos(){
  #kubectl apply -f ${flannel_yml} >/dev/null 2>&1
  kubectl apply -f ${multus_yml} >/dev/null 2>&1
  kubectl apply -f ${megalos_yml} >/dev/null 2>&1
  #kubectl apply -f ./megalos/network.yml >/dev/null 2>&1
}

function stop_megalos(){
  #kubectl delete -f ./megalos/network.yml >/dev/null 2>&1
  kubectl delete -f ${megalos_yml} >/dev/null 2>&1
  kubectl delete -f ${multus_yml} >/dev/null 2>&1
  #kubectl delete -f ${flannel_yml} >/dev/null 2>&1
}

function status_megalos(){

  echo "unknown"
}

function api_setup(){
  api_server=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"default\")].cluster.server}")
  # TODO: Access Token for Kathara
  printf "API-Server:\n%s\n" "${api_server}"

  proxy=$1
  printf "Proxy:\n%s\n" "${proxy}"

  # Get the token value
  kubectl apply -f ./megalos/kathara-token.yml >/dev/null 2>&1
  token=$(kubectl get secret kathara-token -o jsonpath='{.data.token}' | base64 --decode)
  printf "Token for Kathara:\n%s\n" "${token}"

  while true; do
      read -r -p "Do you wish to setup Kathara (y/n)? " yn
      case $yn in
          [Yy]* ) config_kathara "${proxy}" "${token}"; break;;
          [Nn]* ) exit;;
          * ) echo "Please answer yes or no.";;
      esac
  done

}

function config_kathara(){
  jq '.manager_type = "kubernetes"' "${kathara_config}" > new_kathara.conf
  jq --arg a "${1}" '.api_server_url=$a' new_kathara.conf > tmp.conf
  jq --arg b "${2}" '.api_token=$b' tmp.conf > new_kathara.conf
  rm tmp.conf
  jq '.' new_kathara.conf
  mv new_kathara.conf "${HOME}"/.config/kathara.conf
}

function attach_shell(){
  kubectl -n default exec --stdin --tty redis-pod -- /bin/sh
}

case $1 in
start)
  start_megalos
  ;;

stop)
  stop_megalos
  ;;

api)
  api_setup "$(proxy_start)"
  ;;

esac
