#!/bin/sh

# Retrieve the IP address of the gateway, crypto and wallet services from DNS resolution
gateway_ip=$(getent hosts gateway | awk '{ print $1 }')


# Export the IP addresses as environment variables

export GATEWAY_BASE_URL=http://$gateway_ip:3000

env

npm run dev

exec "$@"