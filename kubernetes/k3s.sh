#!/usr/bin/env bash
proxy_port=8001
proxy_address="localhost"

K3D_CLUSTER="dev"

source ./lib/k3d.sh
source ./lib/proxy.sh
source ./lib/dashboard.sh
source ./lib/megalos.sh

function sub_kubernetes(){
  case $1 in
  create)
    echo "Create cluster with k3d and install it if necessary";
    create_cluster ${K3D_CLUSTER};;
  delete)
    echo "Delete cluster";
    delete_cluster ${K3D_CLUSTER};;
  uninstall)
    echo "Uninstall k3d";
    uninstall_k3d;;
  esac
}

function sub_dashboard(){
  case $1 in
  start)
    echo "starting dashboard";
    start_dashboard;;
  stop)
    echo "stopping dashboard";
    stop_dashboard;;
  state)
    status_dashboard "$(proxy_address)";;
  esac
}

function sub_weave(){
  case $1 in
  start)
    echo "starting weave dashboard";
    start_weave_scope;;
  stop)
    echo "stopping weave dashboard";
    stop_weave_scope;;
  state)
    status_weave;;
  esac
}

function sub_megalos(){
  case $1 in
  start)
    echo "starting Megalos";
    start_megalos;;
  stop)
    echo "stopping Megalos";
    stop_megalos;;
  state)
    echo "State of the Megalos";;
  kathara)
    echo "Setting up Kathara";
    api_setup "$(proxy_address)";;
  esac
}

function sub_proxy(){
  case $1 in
  start)
    echo "starting proxy";
    proxy_start;;
  stop)
    echo "stopping proxy";
    proxy_stop;;
  state)
    proxy_is_running;;
  esac
}

function sub_start(){
  sub_kubernetes create
  sub_dashboard start
  sub_weave start
  sub_megalos start
  sub_proxy start
}


function sub_help(){
cat << EOM
This script helps run a specified video stream with different codecs.
Usage: $ProgName <subcommand> [required] {optional}
Subcommands
  start                                Creates cluster and starts dashboard, weave, megalos and proxy
  kubernetes [create|delete|uninstall] Installing k3d, create and delete a cluster
  dashboard [start|stop|state]         Executing a Kubernetes Dashboard on k3s
  weave [start|stop|state]             Executing Weave Scope on port 4040 (Dashboard)
  megalos [start|stop|state|kathara]   Starting the Megalos Framework
  proxy [start|stop|state]             Checking the Kubernetes Proxy

For help with each subcommand run:
$ProgName <subcommand> -h|--help
EOM
}

# https://www.suse.com/c/advanced-kubernetes-networking/
subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift
        echo "Running for ${subcommand}, if available"
        sub_"${subcommand}" "$@"
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac