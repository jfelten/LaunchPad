#!/usr/bin/env node

var path = require('path')
, fs = require('fs')
,agent  = path.join(path.dirname(fs.realpathSync(__filename)), '../node_modules/knowhow_agent/agent.js');

console.log("executing: "+agent);
require(agent);
