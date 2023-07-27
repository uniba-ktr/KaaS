#!/bin/bash
source proxy.sh
showtoken=1
# not working with k3s:
cmd="kubectl"
# TODO: grep for open proxy_port with ss
count=`pgrep -cf "$cmd"`
version_kube_dashboard="v2.7.0"
dashboard_yaml="https://raw.githubusercontent.com/kubernetes/dashboard/${version_kube_dashboard}/aio/deploy/recommended.yaml"
msgstarted="Kubernetes Dashboard \e[32mstarted\e[0m"
msgstopped="Kubernetes Dashboard \e[31mstopped\e[0m"
msginstalled="K3s successfully \e[32minstalled\e[0m"


# TODO Skooner?

function install_k3s(){
  curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
  echo -e "$msginstalled"
}

function start_dashboard() {
    kubectl apply -f $dashboard_yaml >/dev/null 2>&1
    kubectl apply -f ./dashboard/dashboard.admin-user.yml >/dev/null 2>&1
    kubectl apply -f ./dashboard/dashboard.admin-user-role.yml >/dev/null 2>&1
    kubectl apply -f ./dashboard/dashboard.read-only.yml >/dev/null 2>&1

    if [ $count = 0 ]; then
       nohup "$cmd" >/dev/null 2>&1 &
       echo -e "$msgstarted"
    else
       echo "Kubernetes Dashboard already running"
    fi
}

function stop_dashboard() {
    showtoken=0
    kubectl delete -f $dashboard_yaml >/dev/null 2>&1
    kubectl delete -f ./dashboard/dashboard.admin-user.yml >/dev/null 2>&1
    kubectl delete -f ./dashboard/dashboard.admin-user-role.yml >/dev/null 2>&1
    kubectl delete -f ./dashboard/dashboard.read-only.yml >/dev/null 2>&1
    echo -e "$msgstopped"
}

function open_browser(){
  sensible-browser ${1}
}

case $1 in
install)
  install_k3s
  ;;
start)
  start_dashboard
  ;;
stop)
  stop_dashboard
  ;;
status)
  found=$(kubectl get serviceaccount admin-user -n kubernetes-dashboard 2>/dev/null)
  if [[ $count = 0 ]] || [[ $found = "" ]]; then
     showtoken=0
     echo -e "$msgstopped"
  else
     found=$(kubectl get clusterrolebinding admin-user -n kubernetes-dashboard 2>/dev/null)
     if [[ $found = "" ]]; then
        nopermission=" but user has no permissions."
        echo -e "$msgstarted""$nopermission"
        echo 'Run "dashboard start" to fix it.'
     else
        echo -e "$msgstarted"
     fi
  fi
  ;;
esac

# Show full command line # ps -wfC "$cmd"
if [ $showtoken -gt 0 ]; then
  # Accessing the KUBE-API https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/
  # TODO check if proxy is already running
  proxy=$(proxy_start)
  printf "Proxy:\n%s\n" "${proxy}"

  dashboard="http://${proxy_address}:${proxy_port}/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"

  printf "Access Dashboard at:\n%s\n" ${dashboard}

  admin_token=$(kubectl -n kubernetes-dashboard describe secret "$(kubectl -n kubernetes-dashboard describe serviceaccounts admin-user | grep 'Tokens' | awk '{ print $2 }')" | grep 'token:' | awk '{ print $2}')
  # Show token
  printf "Admin token (permanent):\n%s\n" ${admin_token}

  user_token=$(kubectl create token read-only-user -n kubernetes-dashboard)
  printf "User read-only token (expires):\n%s\n" ${user_token}

  while true; do
        read -p "Do you wish to open the proxy in your browser (y/n)? " yn
        case $yn in
            [Yy]* ) open_browser "${dashboard}" "${admin_token}"; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
fi