'use strict';

//the level 1 checks for squares ordered acsending.

module.exports = function(_) {
	return {
		displayName: 'Level 2',
		
		code: 'level-2',
		
		checkCompleted: function(squares) {
			var len = squares.length;
	
			for(var i = 1; i < len - 1; i += 1) {
				if (squares[i] !== len - i) {
					return false;
				}
			}
	
			return true;
		},
	
		reset: function(rows, cols) {
			var targetSquares = rows * cols,
				squares = _.range(targetSquares - 1, 0, -1);
	
			squares.splice(0, 0, null);
			return squares;
		}
	};
};