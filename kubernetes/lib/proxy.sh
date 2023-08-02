#!/usr/bin/env bash


running=$(ss -tlp | grep :"${proxy_port}" | awk '{print $6}' | sed -e 's#.*pid=\([^,*]*\).*#\1#')

msgrunning="Proxy is \e[32mstarted\e[0m"
msgstopped="Proxy is \e[31mstopped\e[0m"
msginstalled="K3s successfully \e[32minstalled\e[0m"
K3S_VERSION="v1.26.7+k3s1"


proxy="http://${proxy_address}:${proxy_port}"

function install_k3s(){
  curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${K3S_VERSION}" sh -s - --write-kubeconfig-mode 644
  echo -e "$msginstalled"
}

function uninstall_k3s(){
  /usr/local/bin/k3s-uninstall.sh
}

function install_rancher(){
  echo "Helm must be installed"
  helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
  kubectl create namespace cattle-system
  install_cert_manager

  helm install rancher rancher-latest/rancher \
    --namespace cattle-system \
    --set hostname=rancher.test \
    --set replicas=1
}

function install_cert_manager(){
  # If you have installed the CRDs manually instead of with the `--set installCRDs=true` option added to your Helm install command, you should upgrade your CRD resources before upgrading the Helm chart:
  kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml

  # Add the Jetstack Helm repository
  helm repo add jetstack https://charts.jetstack.io

  # Update your local Helm chart repository cache
  helm repo update

  # Install the cert-manager Helm chart
  helm install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --version v1.5.1
}

function install_helm(){
  curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod +x get_helm.sh
  sudo ./get_helm.sh
  rm get_helm.sh
}

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
