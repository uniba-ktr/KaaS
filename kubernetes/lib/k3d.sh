#!/usr/bin/env bash

#https://yannalbou.medium.com/k3s-k3d-k8s-a-new-perfect-match-for-dev-and-test-e8b871aa6a42
function install_apt(){
  pckg=${1}
  if [ $(dpkg-query -W -f='${Status}' ${pckg} 2>/dev/null | grep -c "ok installed") -eq 0 ];
  then
    sudo apt-get update -qq;
    sudo apt-get install -yq ${pckg};
  fi
}

function install_snap(){
  pckg=${1}
  shift
  config_opts=$@
  if $(snap list | grep -vqz ${pckg});
  then
    sudo snap install ${pckg} ${config_opts};
  fi
}

function install_k3d(){
  curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | TAG=v5.5.1 bash
  echo -e "$msginstalled"
  install_apt snapd
  install_snap kubectl --classic

  if [ -d "${HOME}/.bash_it" ]; then
    # Take action if $DIR exists. #
    echo "Installing completion for bash-it"
    k3d completion bash > "${HOME}/.bash_it/completion/available/k3d.completion.bash"
  fi
}

function create_cluster(){
  if ! [ -x "$(command -v k3d)" ]; then
    install_k3d;
  fi
  k3d cluster create "${1}" --port 8080:80@loadbalancer \
                            --port 8443:443@loadbalancer \
                            --api-port 6443 \
                            --agents 2
                            #--k3s-arg "--flannel-backend=none@server:*" \
                            #--k3s-arg "--flannel-backend=none@agent:*"
                            #--volume "$(pwd)/kube-flannel.yml:/var/lib/rancher/k3s/server/manifests/kube-flannel.yml"
                            #--volume "$(pwd)/calico.yaml:/var/lib/rancher/k3s/server/manifests/calico.yaml"
                            # --servers 1 --agents 3 \
}

function delete_cluster(){
  k3d cluster delete "${1}"
}

function uninstall_k3d(){
  k3d cluster delete -a
  sudo rm $(which k3d)
  snap remove kubectl
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