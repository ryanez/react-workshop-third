'use strict';

module.exports = function(React, _, Square, gameStore) {
    return React.createClass({
        displayName: 'Container',
    
        getInitialState: function() {
            return getGameState();
        },
    
        componentWillMount: function() {
            gameStore.addChangeListener(this.onGameStateChange);
        },
    
        componentWillUnmount: function() {
            gameStore.removeChangeListener(this.onGameStateChange);
        },
    
        onGameStateChange: function() {
            this.setState(getGameState());
        },
    
        createSquares: function(cols, rows) {                
            return _.map(this.state.squares, createSquare);
                
            function createSquare(number, index) {
                return number ? 
                    (<Square
                        number={number}
                        key={number}
                        index={index} 
                        cols={cols}/>) 
                    : null;
            }
        },
        
        randomClickHandler: function() {
            gameStore.random();
        },
    
        render: function() {
            var cols = this.state.cols,
                rows = this.state.rows,
                sqWidth = this.state.squareWidth,
                sqHeight = this.state.squareHeight,
                squares = this.createSquares(cols, rows),
                style = {
                    width: (sqWidth * cols + 5) + 'px',
                    height: (sqHeight * rows + 50) + 'px'
                };
    
            return (
                <div className="container" style=
                    {style}>{squares}
                    <button onClick={this.randomClickHandler}>Random</button>
                    <label>{this.state.completed ? 'Te la rifaste' : 'siguele dando'}</label>
                </div>
                );
        }
    });
    
    function getGameState() {
        return gameStore.getState();
    }
};