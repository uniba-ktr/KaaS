#!/usr/bin/env bash

# Script needs to be executed as admin
SUDO=''
if (( $EUID != 0 )); then
    SUDO='sudo'
fi

tld=kaas.test

function sub_dnsmasq(){
# Disable systemd-resolved
$SUDO systemctl disable systemd-resolved
$SUDO systemctl stop systemd-resolved
# Activate the dnsmasq plugin
cat <<CONF | $SUDO tee /etc/NetworkManager/conf.d/00-use-dnsmasq.conf
[main]
dns=dnsmasq
CONF
# Setup the public DNS and the `.${tld}` pseudo-TLD
cat <<CONF | $SUDO tee /etc/NetworkManager/dnsmasq.d/00-dns-public.conf
server=1.1.1.1
CONF
cat <<CONF | $SUDO tee /etc/NetworkManager/dnsmasq.d/00-address-local.conf
address=/.${tld}/127.0.0.1
CONF
cat <<CONF | $SUDO tee /etc/NetworkManager/dnsmasq.d/02-add-hosts.conf
addn-hosts=/etc/hosts
CONF
$SUDO systemctl restart NetworkManager
# Disable systemd-resolved
$SUDO systemctl enable systemd-resolved
$SUDO systemctl start systemd-resolved
}



function sub_hosts(){
cat <<CONF | $SUDO tee -a /etc/hosts
127.0.0.1   ${tld} traefik.${tld} rest.${tld} tty.${tld}
CONF
}

sub_help(){
cat << EOM
This script to insert our test domain to NetworkManager with dnsmasq or to /etc/hosts.
Usage: $ProgName <subcommand> [required] {optional}
Subcommands
  hosts                         Modifies /etc/hosts to use it with KaaS
  dnsmasq                       Modifies Debian's NetworkManager to use dnsmasq for KaaS (not completely tested)
EOM
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        (( $DEBUG )) && print_config
        shift
        echo "Running for ${subcommand}, if available"
        sub_${subcommand} $@
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac