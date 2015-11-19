'use strict';

module.exports = function(React, gameStore) {
	return React.createClass({
		displayName: 'Dashboard',
	
		resetClickHandler: function() {
			gameStore.reset();
		},
	
		randomClickHandler: function() {
			gameStore.random();
		},
		
		render: function() {
			return (
				<div>
					<button onClick={this.resetClickHandler}>Reset</button>
					<button onClick={this.randomClickHandler}>Random</button>
				</div>)
		}
	});
	

	function getGameState() {
		return gameStore.getState();
	}
};