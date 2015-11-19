'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square);

// designed to be called once document is loaded.
module.exports = function(elementId) {
    var element = global.document.getElementById(elementId);

    ReactDOM.render(<Container />, element);
};