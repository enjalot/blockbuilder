# Deploy
These are scripts for deploying your own server.

# Amazon AMI
You can install everything yourself, or use a pre-packaged AMI running Ubuntu 14.04 with everything up and running. The AMI id is `ami-d52e87be`. The user is `ubuntu` and the code is deployed in `/home/ubuntu/Code/building-blocks`. 

## Updating:
This process also applied if you are running your own server

SSH into server and run `make update`.

This will run `git pull` to update the code base. It will also run `npm install` and `npm run build` to ensure dependencies are up to date after a pull and to build the build artifacts. 

# Rolling Your Own Server
If you wish to roll your own server, the following steps serve as a guide for getting everything up and running.

## IP Tables
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

## Upstart / Monit
The following assumes that everything is setup in `/home/ubuntu/Code/building-blocks`

### upstart
[Upstart](http://upstart.ubuntu.com/) provides a way to start / stop services.

#### building-blocks.conf
This is the upstart script which allows us to run `service building-blocks start` to startup the service. Copy to `/etc/init/building-blocks.conf`.

### monit
[Monit](https://mmonit.com/monit/) will watch processes and restart them if they stop. It is optional. 

#### monitrc
Configuration file for monit. Copy to `/etc/monit/monitrc`

### monit-building-blocks
Configuration file for watching building-blocks with monit. Copy to `/etc/monit/conf.d/building-blocks`

## Git

If you encounter an error where git is complaining about not knowing who you are when trying to save a thumbnail. Run:
```bash
sudo su root
git config --global user.email "buildingblocks@example.com"
git config --global user.name "Building Blocks"
 ```
