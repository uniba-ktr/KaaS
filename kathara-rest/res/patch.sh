#!/usr/bin/env bash
python_version=$(python3 -V | awk '{print $2}')
patch /usr/lib/python${python_version%.*}/site-packages/Kathara/manager/docker/stats/DockerMachineStats.py < /kathara-rest/res/DockerMachineStats.patch
