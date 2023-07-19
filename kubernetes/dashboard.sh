#!/bin/bash
showtoken=1
cmd="kubectl proxy"
count=`pgrep -cf "$cmd"`
version_kube_dashboard="v2.7.0"
dashboard_yaml="https://raw.githubusercontent.com/kubernetes/dashboard/${version_kube_dashboard}/aio/deploy/recommended.yaml"
msgstarted="-e Kubernetes Dashboard \e[32mstarted\e[0m"
msgstopped="-e Kubernetes Dashboard \e[31mstopped\e[0m"

case $1 in
start)
   kubectl apply -f $dashboard_yaml >/dev/null 2>&1
   kubectl apply -f ./dashboard/dashboard.admin-user.yml >/dev/null 2>&1
   kubectl apply -f ./dashboard/dashboard.admin-user-role.yml >/dev/null 2>&1
   kubectl apply -f ./dashboard/dashboard.read-only.yml >/dev/null 2>&1

   if [ $count = 0 ]; then
      nohup $cmd >/dev/null 2>&1 &
      echo $msgstarted
   else
      echo "Kubernetes Dashboard already running"
   fi
   ;;

stop)
   showtoken=0
   if [ $count -gt 0 ]; then
      kill -9 $(pgrep -f "$cmd")
   fi
   kubectl delete -f $dashboard_yaml >/dev/null 2>&1
   kubectl delete -f ./dashboard/dashboard.admin-user.yml >/dev/null 2>&1
   kubectl delete -f ./dashboard/dashboard.admin-user-role.yml >/dev/null 2>&1
   kubectl delete -f ./dashboard/dashboard.read-only.yml >/dev/null 2>&1
   echo $msgstopped
   ;;

status)
   found=`kubectl get serviceaccount admin-user -n kubernetes-dashboard 2>/dev/null`
   if [[ $count = 0 ]] || [[ $found = "" ]]; then
      showtoken=0
      echo $msgstopped
   else
      found=`kubectl get clusterrolebinding admin-user -n kubernetes-dashboard 2>/dev/null`
      if [[ $found = "" ]]; then
         nopermission=" but user has no permissions."
         echo $msgstarted$nopermission
         echo 'Run "dashboard start" to fix it.'
      else
         echo $msgstarted
      fi
   fi
   ;;
esac

# Show full command line # ps -wfC "$cmd"
if [ $showtoken -gt 0 ]; then
  echo "Access Dashboard at:"
  echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
  echo

   # Show token
   echo "Admin token:"
   kubectl create token admin-user -n kubernetes-dashboard
   #kubectl get secret -n kubernetes-dashboard $(kubectl get serviceaccount admin-user -n kubernetes-dashboard -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
   echo

   echo "User read-only token:"
   kubectl create token read-only-user -n kubernetes-dashboard
   #kubectl get secret -n kubernetes-dashboard $(kubectl get serviceaccount read-only-user -n kubernetes-dashboard -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
   echo
fi