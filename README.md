# Building Bl.ocks
Create, fork and edit d3.js code snippets for use with bl.ocks.org right in the browser, no terminal required.

# Usage
Eventually we will host this with a domain, but for now let's just get it running locally by following the instructions in Development.

# Development
To setup the server locally, setup dependencies then setup the server.

## Dependencies
NodeJS, MongoDB, and Redis are required (for sessions and users) so make sure you install them before proceeding any further. If you would like to tweak the default parameters, you can do so my modifying `server.js`. 

### Setting up databases
Make sure you initialize both Redis and MongoDB before running. 

#### For OS X

		brew install mongodb

		brew install redis


#### To start the databases

To start the mongo database service, open a new terminal tab and run:

		mongod --config /usr/local/etc/mongod.conf

To start the redis server, open a new terminal window and run:

		redis-server

#### For other platforms

1. Refer to [Redis Quick Start](http://redis.io/topics/quickstart) to set up a Redis instance.
2. Refer to [Install MongoDB](http://docs.mongodb.org/manual/installation/) to set up a MongoDB instance for your platform

## Project Setup and Running Server
#### 1. Initial Setup
```bash
git clone https://github.com/enjalot/building-blocks.git
cd building-blocks/
npm install
```

#### 2. Building JS / CSS Files
Built files are not included in this repo. To build files, [webpack](http://webpack.github.io/) is used. 

To have a continually running watch script, which will leave a process running which will re-build the files anytime run:
```bash
npm run buildWatch
```

To build the files once, without watching for changes, run:
```bash
npm run build
```

#### 3. Copy secrets
Building-blocks expects something in the secrets.json file.

If you'd like to enable GitHub authentication (for saving and forking as a logged in user) you will need to: 

1. [Register a GitHub application](https://github.com/settings/developers)  

2. Fill `secrets.json` with the client ID and secret key from GitHub  


Run: 
```bash
cp secrets.json-example secrets.json
```

#### 4. Running the server
This will use node to launch the server:
```bash
node server.js
```

Leave the server running, and now you can access [http://localhost:8889](http://localhost:8889).

Then take any bl.ock and replace the bl.ocks.org part with localhost:8889 like  
[http://localhost:8889/syntagmatic/0d4f736796ab7b465020](http://localhost:8889/syntagmatic/0d4f736796ab7b465020)  


# Deploy your own
TODO

# About this project
This project began as a [Kickstarter project](https://www.kickstarter.com/projects/1058500513/building-blocks-0) to support it's development. The backers that made it possible will be listed below upon completion of the campaign!
