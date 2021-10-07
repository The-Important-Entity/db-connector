'use strict';

require("dotenv").config();
const dbConnector = require("..");

const config = require("../config");
const dbconn = new dbConnector(config);

dbconn.getOrganization("tech-solutions").then(function(response){
    console.log(response);
    dbconn.close();
});