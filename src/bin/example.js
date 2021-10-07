'use strict';

require("dotenv").config();
const dbConnector = require("..");
const dbconn = new dbConnector()

dbconn.getOrganization("tech-solutions").then(function(response){
    console.log(response);
    dbconn.close();
});