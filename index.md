# Blockbuilder

For 5 years this project allowed you to create, fork and edit d3.js code snippets for use with bl.ocks.org right in the browser, no terminal required. Now it's shutdown. You can still run it yourself if you'd like by [cloning the project](https://github.com/enjalot/blockbuilder).

Almost 5 years after the [kickstarter made Blockbuilder real](https://www.kickstarter.com/projects/1058500513/building-blocks-0), In-browser IDEs and code sharing tools are way better and [Observable](https://observablehq.com/) is taking its rightful place as the standard tool for the #d3js community. 

Back in 2015 there was no easy way to quickly share or tweak an existing d3 example, so almost 200 people backed the kickstarter, and in the 5 years since more than 5,000 people have used blockbuilder to create, fork and share d3 examples. In that same time period 400,000 people have visited Blockbuilder over 2 million times. The vast majority of those visits are to those very examples created by the community. 


## Why?
Keeping the IDE code, server backend and the continuous search infrastructure maintained has become too expensive, especially in regards to time:
GitHub is [deprecating one of the ways we authenticate API calls](https://github.com/enjalot/blockbuilder/issues/252), the [elasticsearch index is brittle](https://github.com/enjalot/blockbuilder-search-index#scraping) and the [UI codebase](https://github.com/enjalot/blockbuilder) was established as the very first project I learned React with. shout out to [@micahstubbs](https://twitter.com/micahstubbs) who has been keeping the lights on and shepherding some nice improvements from [@hydrosquall](https://twitter.com/hydrosquall). Dedicating time and attention to refactor and re-architect fundamental aspects of the project is something I can't bring myself to do given the amazing alternatives available today.

## Now what?
[Observable](https://observablehq.com/) is what I've been using for all my open source examples & d3 prototyping over the last 2 years. It's what I wish I could have built and now it's here.  

There is also [@currankelleher's](https://twitter.com/currankelleher) [VizHub](https://vizhub.com/) which feels like an improved (and better maintained) implementation of blockbuilder's core concept.  

On top of that, all the blocks anybody ever made in blockbuilder are still available on bl.ocks.org (the original goal was to help people make more blocks!)

All that said, Blockbuilder has always been open source and a sufficiently motivated person can certainly host their own copy of the IDE.  
https://github.com/enjalot/blockbuilder  
https://github.com/enjalot/blockbuilder-search  
https://github.com/enjalot/blockbuilder-search-index  


## Get Involved
If you are interested in hosting your own copy of the app, please reach out to [me](https://twitter.com/enjalot), [@micahstubbs](https://twitter.com/micahstubbs) or join the #blockbuilder channel on the [d3js slack](https://d3-slackin.herokuapp.com/)

## Thank you

I can't express the depths of my gratitude to the #d3js community for the opportunity to participate in so many people's creative processes. I was deeply moved by the trust granted to me by the kickstarter backers and the support I got from friends and internet acquaintences alike. I'd like to give a personal shout out to a few folks who have strongly supported this project through the years: [Erik Hazzard](https://twitter.com/erikhazzard), [Micah Stubbs](https://twitter.com/micahstubbs), [Shirley Wu](https://twitter.com/sxywu) and [Victor Powell](https://twitter.com/vicapow). Of course none of this would be possible without [Mike Bostock's](https://twitter.com/mbostock) tireless commitment to data visualization tools.
