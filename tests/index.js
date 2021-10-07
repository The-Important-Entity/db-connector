const dbConnector = require("..");
const integration_tests = require("./integration");
const Asserter = require("./assert");
require('dotenv').config();

const run_tests = async function(){
    const tester = new Asserter();
    const config = require("../src/config");
    const dbconn = new dbConnector(config)
    await integration_tests(dbconn, tester);


    tester.printResults();
    dbconn.close();
}

run_tests();