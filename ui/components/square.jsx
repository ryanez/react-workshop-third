'use strict';

module.exports = function(React, gameStore) {
    return React.createClass({
        displayName: 'Square',
    
        propTypes: {
            index: React.PropTypes.number.isRequired,
            number: React.PropTypes.number.isRequired
        },
        
        getInitialState: function() {
            return gameStore.getState();
        },
    
        onSquareClick: function(index, number) {
            gameStore.tryMove(index, number);
        },      
    
        render: function() {
            var index  = this.props.index,
                number = this.props.number,
                cols = this.state.cols,
                rows = this.state.rows,
                sqWidth = this.state.squareWidth,
                sqHeight = this.state.squareHeight,
                style = {
                    left: (index % cols) * sqWidth + 5 + 'px',
                    top: Math.floor(index / cols) * sqHeight + 5 + 'px'
                };

            return (
                <div
                    className="square"
                    style={style}
                    onClick={this.onSquareClick.bind(this, index, number)}
                >{number}</div>);
        }
    });
};