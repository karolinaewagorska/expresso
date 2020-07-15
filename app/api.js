const express = require('express');
const menuRouter = require('./menus.js');
const employeesRouter = require('./employees.js');

apiRouter.use('/menus', menuRouter);
apiRouter.use('/employees', employeesRouter);



const apiRouter = express.apiRouter();

module.exports = apiRouter; 

