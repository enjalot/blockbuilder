# Building Bl.ocks
Create, fork and edit d3.js code snippets for use with bl.ocks.org right in the browser, no terminal required.

# Usage
Eventually we will host this with a domain, but for now let's just get it running locally by following the instructions in Development.

# Development
MongoDB and Redis are required (for sessions and users) so make sure you install them before proceeding any further. If you would like to tweak the default parameters, you can do so my modifying `server.js`. 

### Setting up databases
Make sure you initialize both Redis and MongoDB before running. 

1. Refer to [Redis Quick Start](http://redis.io/topics/quickstart) to set up a Redis instance.
2. Refer to [Install MongoDB](http://docs.mongodb.org/manual/installation/) to set up a MongoDB instance for your platform

### Project Setup and Running Server
```bash
git clone https://github.com/enjalot/building-blocks.git
cd building-blocks/
npm install
# Built JS / CSS are not included. Run webpack to build the js & css bundles (this process watches for any changes to any client-side files and repacks them during development so there might not be any apparent progress in the terminal)
npm run local 
# building-blocks expects something in the secrets.json file, so the last step is: (to place replace this with your credentials, see Registering Github Credentials below)
cp secrets.json-example secrets.json
# run the server (use nodemon or node-dev to restart on code change)
node server.js
```
Then take any bl.ock and replace the bl.ocks.org part with localhost:8889 like  
[http://localhost:8889/syntagmatic/0d4f736796ab7b465020](http://localhost:8889/syntagmatic/0d4f736796ab7b465020)  

### Registering Github Credentials
If you'd like to enable GitHub authentication (for saving and forking as a logged in user) you will need to: 

1. [Register a GitHub application](https://github.com/settings/developers)  
2. Fill `secrets.json` with the client ID and secret key from GitHub  


# Deploy your own
TODO

# About this project
This project began as a [Kickstarter project](https://www.kickstarter.com/projects/1058500513/building-blocks-0) to support it's development. The backers that made it possible will be listed below upon completion of the campaign!
