'use strict';

module.exports = function(React, _, Square) {
    return React.createClass({
        displayName: 'Container',
    
        propTypes: {
            rows: React.PropTypes.number,
            cols: React.PropTypes.number
        },
    
        getDefaultProps: function() {
            return {
                rows: 4,
                cols: 4
            };
        },
    
        getInitialState: function() {
            return {
                squares: this.initSquares(),
                completed: false
            };
        },
    
        initSquares: function() {
            var targetSquares = this.props.rows * this.props.cols,
                squares = _.range(1, targetSquares);
    
            squares.push(null);
            return squares;
        },
    
        onSquareClick: function(index, number) {
            var options = [
                    index - 1, //left
                    index + 1, //right
                    index - this.props.cols, // top
                    index + this.props.cols //bottom
                ],
                targetSquares = this.props.rows * this.props.cols,
                squares = this.state.squares,
                moveTo = _.find(options, function(option) {
                    return option >= 0 && option < targetSquares && squares[option] === null;
                });
    
            if (!isNaN(moveTo)) {
                squares[index] = null;
                squares[moveTo] = number;
                this.setState({
                    squares: squares,
                    completed: this.checkCompleted(squares)
                });
            }
        },
    
        randomClickHandler: function() {
            this.setState({
                squares: _.shuffle(this.state.squares)
            });
        },
    
        checkCompleted: function(squares) {
            for(var i = 0; i < squares.length - 1; i += 1) {
                if (i + 1 != squares[i]) return false;
            }
    
            return true;
        },
    
        createSquare: function(number, index) {
            return number ? 
                (<Square number={number} key={number} index={index} cols={this.props.cols} onClick={this.onSquareClick.bind(this, index, number)}/>) 
                : null;
        },
    
        render: function() {
            var squares = _.map(this.state.squares, this.createSquare),
                style = {
                    width: (50 * this.props.cols) + 'px',
                    height: (50 * this.props.rows + 50) + 'px'
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
};