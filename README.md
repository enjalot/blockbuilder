# Building Bl.ocks
Create, fork and edit d3.js code snippets for use with bl.ocks.org right in the browser, no terminal required.

# Usage
Eventually we will host this with a domain, but for now let's just get it running locally by following the instructions in Development.

# Development

MongoDB and Redis are required (for sessions and users), they are currently configured inside `server.js`

```bash
git clone https://github.com/enjalot/building-blocks.git
cd building-blocks/
npm install
# run webpack to build the js & css bundles
npm run local
# run the server (use node-dev server.js for auto-restarting on changes to server code)
node server.js
```
Then take any bl.ock and replace the bl.ocks.org part with localhost:8889 like  
[http://localhost:8889/syntagmatic/0d4f736796ab7b465020](http://localhost:8889/syntagmatic/0d4f736796ab7b465020)  


# Deploy your own
TODO

# About this project
This project began as a [Kickstarter project](https://www.kickstarter.com/projects/1058500513/building-blocks-0) to support it's development. The backers that made it possible will be listed below upon completion of the campaign!
