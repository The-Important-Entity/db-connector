'use strict';

const run_tests = async function(dbconn, tester){
    var response = await dbconn.getOrganization("tech-solutions");
    var info = "Test get organization when organization exists";
    tester.assert(info, JSON.stringify(response), JSON.stringify([{
          id: 1,
          name: 'tech-solutions',
          email: 'joe@gmail.com',
          password: '$2b$10$ZEeBC8rawVk/PiuVG9bqyuaRcX0PiRAlVrG1ZqBGObYre52gJ6bRO'
        }]));
}

module.exports = run_tests;