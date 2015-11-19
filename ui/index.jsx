'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    moment = require('moment'),
    fluxtore = require('fluxtore'),
    level1Factory = require('./stores/levels/level-1'),
    level1 = level1Factory(_),
    level2Factory = require('./stores/levels/level-2'),
    level2 = level2Factory(_),
    levelsFactory = require('./stores/levels'),
    levels = levelsFactory(level1, level2),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _, levels),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore),
    DashboardFactory = require('./components/dashboard.jsx'),
    Dashboard = DashboardFactory(React, moment, gameStore);

// designed to be called once document is loaded.
module.exports = function(containerId, dashboardId) {
    var containerElement = global.document.getElementById(containerId);
    var dashboardElement = global.document.getElementById(dashboardId);

    ReactDOM.render(<Container />, containerElement);
    ReactDOM.render(<Dashboard />, dashboardElement);
};