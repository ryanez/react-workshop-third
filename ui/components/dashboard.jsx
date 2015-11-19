'use strict';

module.exports = function(React, moment, _, gameStore) {
	return React.createClass({
		displayName: 'Dashboard',
		
		propTypes: {
			frequency: React.PropTypes.number
		},

		getDefaultProps: function() {
			return {
				frequency: 1
			};
		},
	
		getInitialState: function() {
			return {
				timer: moment({hour: 0}),
				moves: 0,
            	levels: gameStore.getLevels(),
				currentLevelCode: gameStore.getCurrentLevelCode()
			};
		},
	
		componentWillMount: function() {
			gameStore.addChangeListener(this.onGameChangeListener);
			gameStore.addResetListener(this.onGameResetListener);
		},
	
		componentDidMount: function() {
			this.initTicks();
		},
	
		componentWillUnmount: function() {
			gameStore.removeChangeListener(this.onGameChangeListener);
			gameStore.removeResetListener(this.onGameResetListener);
			clearInterval(this.interval);
		},
	
		onGameChangeListener: function() {
			var gameSate = getGameState();
			gameSate.moves = this.state.moves + 1;
			this.setState(gameSate);
		},
	
		onGameResetListener: function() {
			this.setState({
				moves: 0,
				timer: moment({hour: 0}),
				currentLevelCode: gameStore.getCurrentLevelCode()
			});
		},
	
		initTicks: function() {
			this.interval = setInterval(this.tick, 1000 * this.props.frequency);
		},
	
		tick: function() {
			if (this.state.completed) {
				return;
			}
	
			this.setState({
				timer: this.state.timer.add(this.props.frequency, 's')
			});
		},
	
		resetClickHandler: function() {
			gameStore.reset();
		},
	
		randomClickHandler: function() {
			gameStore.random();
		},

		levelChangeHandler: function(e) {
			var code = e.currentTarget.value;
			gameStore.selectLevel(code);
		},

		getDisplayTime: function() {
			return this.state.timer.format('HH:mm:ss [elapsed]');
		},
		
		render: function() {
			var options = _.map(this.state.levels, function(level) {
				return (<option value={level.code} key={level.code}>{level.displayName}</option>);
			});

			return (
				<div>
					<span>Moves: {this.state.moves}</span>
					<span>Time elapsed: {this.getDisplayTime()}</span>
					<select defaultValue={this.state.currentLevelCode} onChange={this.levelChangeHandler}>{options}</select>
					<button onClick={this.resetClickHandler}>Reset</button>
					<button onClick={this.randomClickHandler}>Random</button>
				</div>)
		}
	});
	

	function getGameState() {
		return gameStore.getState();
	}
};