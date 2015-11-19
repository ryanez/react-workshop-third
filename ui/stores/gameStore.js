'use strict';

module.exports = function(fluxtore, _, levels) {
	var store,
		currentLevel = levels[1],
		squares,
		cols = 6,
		rows = 5,
		squareWidth = 60,
		squareHeight = 60,
		completed = false;
	
	return store = fluxtore.createStore({
		events: ['change', 'invalidMove', 'reset'],
		
		getState: getState,
		
		getLevels: getLevels,
		
		getCurrentLevelCode: getCurrentLevelCode, 

		actions: {
			tryMove: tryMove,
			random: random,
			reset: reset,
        	selectLevel: selectLevel
		}
	});
	
	function getState() {
		if (!squares) {
			squares = currentLevel.reset(rows, cols);
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

	function getCurrentLevelCode() {
		return currentLevel.code;
	}
	
	function getLevels() {
		return _.map(levels, function(level) {
			return _.extend({
				displayName: level.displayName,
				code: level.code
			}, level);
		});
	}
	
	function selectLevel(code) {
		var level = _.find(levels, { code: code });
	
		if (level) {
			currentLevel = level;
			reset();
		}
	}
	
	function reset() {
		squares = currentLevel.reset(rows, cols);
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
			completed = currentLevel.checkCompleted(squares);
			store.emitChange();
		} else {
			store.emitInvalidMove(index, number);
		}
	}
		
	function random() {
		squares = _.shuffle(squares);
		completed = false;
		store.emitChange();
		store.emitReset();
	}
};