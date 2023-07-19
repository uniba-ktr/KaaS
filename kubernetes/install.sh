#!/usr/bin/env bash


function install_k3(){
  curl -sfL https://get.k3s.io | sh -

cat <<CONF | sudo tee -a /etc/systemd/system/k3s.service.env
K3S_KUBECONFIG_MODE="644"
CONF
   sudo kubectl proxy >/dev/null 2>&1
}

function kat_megalos(){
  kubectl apply -f https://raw.githubusercontent.com/KatharaFramework/Megalos-CNI/master/kathara-daemonset.yml
  kubectl apply -f network.yml
}
