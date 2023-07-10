#!/usr/bin/env bash

# Script needs to be executed as admin

# Disable systemd-resolved
systemctl disable systemd-resolved
systemctl stop systemd-resolved
unlink /etc/resolv.conf
# Activate the dnsmasq plugin
cat <<CONF | tee /etc/NetworkManager/conf.d/00-use-dnsmasq.conf
[main]
dns=dnsmasq
CONF
# Setup the public DNS and the `.test` pseudo-TLD
cat <<CONF | tee /etc/NetworkManager/dnsmasq.d/00-dns-public.conf
server=1.1.1.1
CONF
cat <<CONF | tee /etc/NetworkManager/dnsmasq.d/00-address-local.conf
address=/.test/127.0.0.1
CONF
systemctl restart NetworkManager