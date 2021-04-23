#!/bin/bash
if [ -z ${NODE} ]
then
	NODE="dms-frontend_${HOSTNAME}"
fi

# setting up SIGTERM handler for consul agent
CONSUL_PID=0
term_handler () {
    if [ ${CONSUL_PID} -ne 0 ]; then
        kill "${CONSUL_PID}"
        wait "${CONSUL_PID}"
    fi
    exit 143;
}
trap term_handler TERM

nginx &
consul agent -config-dir /consul/config -node ${NODE} &
CONSUL_PID="$!"
sleep 10
consul connect envoy -sidecar-for dms-frontend &
wait "${CONSUL_PID}"
