'use strict';

module.exports = function(React) {
    return React.createClass({
        displayName: 'Square',
    
        propTypes: {
            index: React.PropTypes.number.isRequired,
            number: React.PropTypes.number.isRequired
        },
    
        render: function() {
            var index  = this.props.index,
                number = this.props.number,
                cols = this.props.cols,
                style = {
                left: (index % cols) * 50 + 'px',
                top: Math.floor(index / cols) * 50 + 'px'
            };
    
            return (<div className="square" style={style} onClick={this.props.onClick}>{number}</div>);
        }
    });
};