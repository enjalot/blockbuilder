# Deploy
These are scripts for deploying your own server.


## upstart
### building-blocks.conf
This is the upstart script which allows us to run `service building-blocks start` to startup the service

## monit
### monitrc
Configuration file for monit. Copy to `/etc/monit/monitrc`

### monit-building-blocks
Configuration file for watching building-blocks with monit. Copy to `/etc/monit/conf.d/building-blocks`
