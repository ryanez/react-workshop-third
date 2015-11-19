'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    fluxtore = require('fluxtore'),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore),
    DashboardFactory = require('./components/dashboard.jsx'),
    Dashboard = DashboardFactory(React, gameStore);

// designed to be called once document is loaded.
module.exports = function(containerId, dashboardId) {
    var containerElement = global.document.getElementById(containerId);
    var dashboardElement = global.document.getElementById(dashboardId);

    ReactDOM.render(<Container />, containerElement);
    ReactDOM.render(<Dashboard />, dashboardElement);
};