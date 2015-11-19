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
        
        componentWillMount: function() {
            gameStore.addInvalidMoveListener(this.onInvalidMove);
        },
    
        componentWillUnmount: function() {
            gameStore.removeInvalidMoveListener(this.onInvalidMove);
        },
    
        onInvalidMove: function(index) {
            if (index === this.props.index) {
                this.setState({
                    invalid: true
                });
    
                setTimeout(function() {
                    this.setState({
                        invalid: false
                    });
                }.bind(this), 1000);
            }
        },
    
        render: function() {
            var index  = this.props.index,
                number = this.props.number,
                cols = this.state.cols,
                rows = this.state.rows,
                sqWidth = this.state.squareWidth,
                sqHeight = this.state.squareHeight,
                className = 'square ' + (this.state.invalid ? 'invalid' : ''),
                style = {
                    left: (index % cols) * sqWidth + 5 + 'px',
                    top: Math.floor(index / cols) * sqHeight + 5 + 'px'
                };

            return (
                <div
                    className={className}
                    style={style}
                    onClick={this.onSquareClick.bind(this, index, number)}
                >{number}</div>);
        }
    });
};