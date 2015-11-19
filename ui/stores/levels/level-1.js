'use strict';

//the level 1 checks for squares ordered acsending.

module.exports = function(_) {
	return {
		displayName: 'Level 1',
		
		code: 'level-1',
		
		checkCompleted: function(squares) {
			var len = squares.length;
	
			for(var i = 0; i < len - 1; i += 1) {
				if (squares[i] !== i + 1) {
					return false;
				}
			}
	
			return true;
		},
	
		reset: function(rows, cols) {
			var targetSquares = rows * cols,
				squares = _.range(1, targetSquares);
	
			squares.push(null);
			return squares;
		}
	};
};