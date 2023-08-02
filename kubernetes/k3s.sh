#!/usr/bin/env bash
proxy_port=8001
proxy_address="localhost"

source ./lib/proxy.sh
source ./lib/dashboard.sh
source ./lib/megalos.sh

function sub_kubernetes(){
  case $1 in
  install)
    echo "Install k3d";
    install_k3d;;
  uninstall)
    echo "Uninstall k3s";
    uninstall_k3s;;
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
    echo "TODO";;
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


function sub_help(){
cat << EOM
This script helps run a specified video stream with different codecs.
Usage: $ProgName <subcommand> [required] {optional}
Subcommands
  kubernetes [install|uninstall]       Installing k3s and dependencies for this script
  dashboard [start|stop|state]         Executing a Kubernetes Dashboard on k3s
  weave [start|stop|state]             Executing Weave Scope on port 4040 (Dashboard)
  megalos [start|stop|state|kathara]   Starting the Megalos Framework
  proxy [start|stop|state]             Checking the Kubernetes Proxy

For help with each subcommand run:
$ProgName <subcommand> -h|--help
EOM
}

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