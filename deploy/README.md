# Deploy
These are scripts for deploying your own server. We currently host blockbuilder on a Google Cloud Platform `n1-standard-2 (2 vCPUs, 7.5 GB memory)` VM instance running Ubuntu 16.04 LTS

This guide will list the steps required to setup a new blockbuilder server.

## Configure Git User

```bash
sudo su root
git config --global user.email "buildingblocks@example.com"
git config --global user.name "Building Blocks"
 ```
 
(this prevents an error where git is complains about not knowing who you are when trying to save a thumbnail image)  

## Install node & npm with nvm

Install  node version `v8.12.0` 

Follow [this guide from Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04), starting at the `How To Install Using NVM` section

once you install node & npm, you should see:

```bash
node -v
# v8.12.0
npm -v
# 6.4.1
```

## Install dependencies & build

```bash
npm install
npm run buildProd
 ```
 
 ## Copy over secrets.json
 
 ## Start MongoD
 
 ## Start Redis
 
 ```bash 
 redis-server
 ```
 
 ## Test server

```bash
cd blockbuilder
node server.js
```
 
 Make sure that that `node server.js` works without errors before proceeding.  It's easier to read the webserver logs and debug errors here, before we wrap it in a linux system service.
 
 ## Create blockbuilder system service to wrap nodejs + express server
We create a linux service called `blockbuilder.service` with [systemd](https://en.wikipedia.org/wiki/Systemd).  Wrapping our nodejs + express web server in a linux service makes sure that the blockbuilder nodejs + express web server stays running, even after a host-server reboot.

to install the service, copy the service defintion from the blockbuilder repo to this systemd directory: 

```bash
sudo cp /home/ubuntu/blockbuilder/deploy/blockbuilder.service /etc/systemd/system/blockbuilder.service
```

We can now manage the `blockbuilder` service with these commands:

```bash
sudo systemctl start blockbuilder
sudo systemctl stop blockbuilder
sudo systemctl status blockbuilder
```

to start our new `blockbuilder` service on boot:

```bash
sudo systemctl enable blockbuilder
```

## Networking
Note that the server runs on port `8889`, so you will need to redirect port 80 traffic to port 8889 due to Ubuntu's security restrictions.

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8889
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
```

## Update
SSH into server and run `make update`.

This will run `git pull` to update the code base. It will also run `npm install` and `npm run build` to ensure dependencies are up to date after a pull and to build the build artifacts. 


## Other dependencies

If your server doesn't have it installed, you will need to get `expect`
```bash
sudo apt-get install expect
````

<details>
<summary>Deprecated instructions</summary>
 
# Amazon AMI
You can install everything yourself, or use a pre-packaged AMI running Ubuntu 14.04 with everything up and running. The AMI id is `ami-d52e87be`. The user is `ubuntu` and the code is deployed in `/home/ubuntu/Code/building-blocks`. 

# Roll Your Own Server
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
</details>
