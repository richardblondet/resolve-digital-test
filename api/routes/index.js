const healthRoutes = require("./health");
const urlRoutes = require('./url');

module.exports = function (app) {
  healthRoutes(app);
  urlRoutes(app);
};
