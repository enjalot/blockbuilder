# Deploy
These are scripts for deploying your own server.

## Server
Note that the server runs on port `8889`, so you will need to redirect port 80 traffic to port 8889. You can do this on ubuntu by using `iptables-persistent` and adding the following to end of `/etc/iptables/rules.v4`:
```
# Route ports to app
*nat
:PREROUTING ACCEPT [1:48]
:INPUT ACCEPT [13:816]
:OUTPUT ACCEPT [18:1447]
:POSTROUTING ACCEPT [18:1447]
-A PREROUTING -p tcp -m tcp --dport 80 -j REDIRECT --to-ports 8889
-A PREROUTING -p tcp -m tcp --dport 443 -j REDIRECT --to-ports 8443
COMMIT
#Done
```

## upstart
### building-blocks.conf
This is the upstart script which allows us to run `service building-blocks start` to startup the service

## monit
### monitrc
Configuration file for monit. Copy to `/etc/monit/monitrc`

### monit-building-blocks
Configuration file for watching building-blocks with monit. Copy to `/etc/monit/conf.d/building-blocks`

