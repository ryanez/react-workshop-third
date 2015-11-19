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
    Container = ContainerFactory(React, _, Square, gameStore);

// designed to be called once document is loaded.
module.exports = function(elementId) {
    var element = global.document.getElementById(elementId);

    ReactDOM.render(<Container />, element);
};