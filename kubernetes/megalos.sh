#!/usr/bin/env bash
megalos_yml="https://raw.githubusercontent.com/KatharaFramework/Megalos-CNI/master/kathara-daemonset.yml"
multus_yml="https://raw.githubusercontent.com/k8snetworkplumbingwg/multus-cni/v4.0.2/deployments/multus-daemonset-thick.yml"

function start_megalos(){
  kubectl apply -f ${multus_yml} >/dev/null 2>&1
  kubectl apply -f ${megalos_yml} >/dev/null 2>&1
  kubectl apply -f ./megalos/network.yml >/dev/null 2>&1
}

function stop_megalos(){
  kubectl delete -f ./megalos/network.yml >/dev/null 2>&1
  kubectl delete -f ${megalos_yml} >/dev/null 2>&1
  kubectl delete -f ${multus_yml} >/dev/null 2>&1
}

function api_setup(){
  # Accessing the KUBE-API https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/
  echo "API-Server: "
  kubectl config view -o jsonpath="{.clusters[?(@.name==\"default\")].cluster.server}"
  # TODO: Access Token for Kathara
  kubectl apply -f ./megalos/kathara-token.yml >/dev/null 2>&1

  # Get the token value
  echo "Token for Kathara: "
  kubectl get secret kathara-token -o jsonpath='{.data.token}' | base64 --decode
  echo

}

case $1 in
start)
  start_megalos
  ;;

stop)
  stop_megalos
  ;;
esac
