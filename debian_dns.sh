#!/usr/bin/env bash

# Script needs to be executed as admin
SUDO=''
if (( $EUID != 0 )); then
    SUDO='sudo'
fi

# Disable systemd-resolved
$SUDO systemctl disable systemd-resolved
$SUDO systemctl stop systemd-resolved
$SUDO unlink /etc/resolv.conf
# Activate the dnsmasq plugin
cat <<CONF | $SUDO tee /etc/NetworkManager/conf.d/00-use-dnsmasq.conf
[main]
dns=dnsmasq
CONF
# Setup the public DNS and the `.test` pseudo-TLD
cat <<CONF | $SUDO tee /etc/NetworkManager/dnsmasq.d/00-dns-public.conf
server=1.1.1.1
CONF
cat <<CONF | $SUDO tee /etc/NetworkManager/dnsmasq.d/00-address-local.conf
address=/.test/127.0.0.1
CONF
cat <<CONF | $SUDO tee /etc/resolv.conf
nameserver 127.0.0.1
CONF
cat <<CONF | $SUDO tee -a /etc/dnsmasq.conf
conf-dir=/etc/NetworkManager/dnsmasq.d/,*.conf
CONF
$SUDO systemctl restart NetworkManager
$SUDO systemctl restart dnsmasq