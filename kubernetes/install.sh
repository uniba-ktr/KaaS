#!/usr/bin/env bash


function install_k3(){
  curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
  sudo kubectl proxy >/dev/null 2>&1
}

function kat_megalos(){
  kubectl apply -f https://raw.githubusercontent.com/KatharaFramework/Megalos-CNI/master/kathara-daemonset.yml
  kubectl apply -f network.yml
}
