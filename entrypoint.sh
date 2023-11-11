#!/bin/sh

# Retrieve the IP address of the gateway, comment services from DNS resolution
gateway_ip=$(getent hosts gateway | awk '{ print $1 }')
comment_ip=$(getent hosts comment | awk '{ print $1 }')
notification_ip=$(getent hosts notification | awk '{ print $1 }')
front_ip=$(getent hosts front | awk '{ print $1 }')



# Export the IP addresses as environment variables

export GATEWAY_BASE_URL=http://$gateway_ip:3000
export COMMENT_BASE_URL=http://$comment_ip:8000
export NOTIFICATION_BASE_URL=http://$notification_ip:8000
export FRONT_BASE_URL=http://$front_ip:5173

env

npm run dev

exec "$@"