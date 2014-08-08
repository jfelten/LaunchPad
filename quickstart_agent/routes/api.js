require('./agent-control');
var agent = require('../agent');
var agentControl = new AgentControl(agent.io);
var loggerControl = new LoggerControl(agent.io);
var agentInfo = agentControl.initAgent(agent.agentData);
var serverInfo;
var rimraf = require('rimraf');

var logger=require('./log-control').logger;
require('./agent-events');
var agentEventHandler = new AgentEventHandler(agent.io,agentControl.eventEmitter);


exports.deleteAgent = function(req,res) {
	logger.info("deleting agent disabled");
	var agent_dir = __dirname+"/../quickstart_agent";
	rimraf(agent_dir, function(err) {
		if (err) {
			logger.error("problem removing agent dir");
			res.json(500, {error:"internal server error"}); // status 500 
		} else {
			res.json({ok:true});
			process.exit();
		}
	});
};


exports.registerAgent = function(req,res) {
	logger.info("register agent");
	var agent = req.data;
	agentControl.registerAgent(agent);
	res.json({ok:true});
	
};

exports.registerServer = function(req,res) {
	logger.info("register server");
	
	serverInfo = req.body;
	serverInfo.ip = req.connection.remoteAddress;
	logger.info("server requesting registration from: "+serverInfo.ip);
	agentEventHandler.registerServer(serverInfo);
	agentControl.registerServer(serverInfo);
	logger.info(agentEventHandler.serverInfo);
	res.json({registered:true});
	
};

exports.execute = function(req,res) {
	logger.info("execute");
	var executable = req.data;
	agentControl.execute(executable);
};

exports.status =function(req,res) {
	var os = require("os");
	  res.json({ agent: {
		    host: os.hostname(),
		    started: startTime,
		    port: agent.port
		  }
	  });
	
};

exports.logs = function(req,res) {
    numLogs=req.body.numLogs;
    console.log("num logs requested="+numLogs);
    require('./log-control').getLastXLogs(numLogs,res);


};

exports.serverInfo = exports.agentInfo = function(req,res) {
	res.json(agentEventHandler.serverInfo);
};

exports.agentInfo = function(req,res) {
	res.json(agentInfo);
};

