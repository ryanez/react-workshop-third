'use strict';

module.exports = function(fluxtore, _) {
	var store,
		squares,
		cols = 6,
		rows = 5,
		squareWidth = 60,
		squareHeight = 60,
		completed = false;
	
	return store = fluxtore.createStore({
		events: ['change', 'invalidMove', 'reset'],
		
		getState: getState,
		
		actions: {
			tryMove: tryMove,
			random: random,
			reset: reset
		}
	});
	
	function getState() {
		if (!squares) {
			squares = initSquares();
		}
	
		return {
			squares: squares,
			rows: rows,
			cols: cols,
			squareHeight: squareHeight,
			squareWidth: squareWidth,
			completed: completed
		};
	}

	function initSquares() {
		var targetSquares = rows * cols,
			result = _.range(1, targetSquares);

		result.push(null);
		
		return result;
	}
	
	function reset() {
		squares = initSquares();
		completed = false;
		store.emitChange();
		store.emitReset();
	}
	
	function tryMove(index, number) {
		var options = [
				index - 1, //left
				index + 1, //right
				index - cols, //top
				index + cols //bottom
			],
			targetSquares = rows * cols,
			moveTo = _.find(options, function(option) {
				return option >= 0 && option < targetSquares && squares[option] === null;
			});
	
		if (!isNaN(moveTo)) {
			squares[index] = null;
			squares[moveTo] = number;
			completed = checkCompleted();
			store.emitChange();
		} else {
			store.emitInvalidMove(index, number);
		}
	}
	
	function checkCompleted() {
		for(var i = 0; i < squares.length - 1; i += 1) {
			if (i + 1 != squares[i]) return false;
		}

		return true;
	}
		
	function random() {
		squares = _.shuffle(squares);
		completed = false;
		store.emitChange();
		store.emitReset();
	}
};