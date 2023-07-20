#!/usr/bin/env bash
megalos_yml="https://raw.githubusercontent.com/KatharaFramework/Megalos-CNI/master/kathara-daemonset.yml"
multus_yml="https://raw.githubusercontent.com/k8snetworkplumbingwg/multus-cni/v4.0.2/deployments/multus-daemonset-thick.yml"
flannel_yml="https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml"
proxy_port=8001
proxy_address="localhost"

function start_megalos(){
  kubectl apply -f ${flannel_yml} >/dev/null 2>&1
  kubectl apply -f ${multus_yml} >/dev/null 2>&1
  kubectl apply -f ${megalos_yml} >/dev/null 2>&1
  kubectl apply -f ./megalos/network.yml >/dev/null 2>&1
}

function stop_megalos(){
  kubectl delete -f ./megalos/network.yml >/dev/null 2>&1
  kubectl delete -f ${megalos_yml} >/dev/null 2>&1
  kubectl delete -f ${multus_yml} >/dev/null 2>&1
  kubectl delete -f ${flannel_yml} >/dev/null 2>&1
}

function api_setup(){
  # TODO Write to Kathara config
  # Accessing the KUBE-API https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/
  # TODO check if proxy is already running
  kubectl proxy --address=$proxy_address --port=$proxy_port  >/dev/null 2>&1 &
  echo "Proxy: "
  echo "http://${proxy_address}:${proxy_port}"

  echo "API-Server: "
  kubectl config view -o jsonpath="{.clusters[?(@.name==\"default\")].cluster.server}"
  # TODO: Access Token for Kathara
  kubectl apply -f ./megalos/kathara-token.yml >/dev/null 2>&1
  echo

  # Get the token value
  echo "Token for Kathara: "
  kubectl get secret kathara-token -o jsonpath='{.data.token}' | base64 --decode
  echo

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
  api_setup
  ;;

esac
