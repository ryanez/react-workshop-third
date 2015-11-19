# react-workshop-third
Tutorial to learn ReactJS by creating a simple game


### install fluxtore

`npm install fluxtore`

### Creating the store

Create a file `/ui/stores/gameStore.js`

```Javascript
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
			random: random
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
```

### Modify the `./ui/compnents/container.jsx` to consume the Store

```Javascript
'use strict';

module.exports = function(React, _, Square, gameStore) {
    return React.createClass({
        displayName: 'Container',
    
        getInitialState: function() {
            return getGameState();
        },
    
        componentWillMount: function() {
            gameStore.addChangeListener(this.onGameStateChange);
        },
    
        componentWillUnmount: function() {
            gameStore.removeChangeListener(this.onGameStateChange);
        },
    
        onGameStateChange: function() {
            this.setState(getGameState());
        },
    
        createSquares: function(cols, rows) {                
            return _.map(this.state.squares, createSquare);
                
            function createSquare(number, index) {
                return number ? 
                    (<Square
                        number={number}
                        key={number}
                        index={index} 
                        cols={cols}/>) 
                    : null;
            }
        },
        
        randomClickHandler: function() {
            gameStore.random();
        },
    
        render: function() {
            var cols = this.state.cols,
                rows = this.state.rows,
                sqWidth = this.state.squareWidth,
                sqHeight = this.state.squareHeight,
                squares = this.createSquares(cols, rows),
                style = {
                    width: (sqWidth * cols + 5) + 'px',
                    height: (sqHeight * rows + 50) + 'px'
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
    
    function getGameState() {
        return gameStore.getState();
    }
};
```

### Update the `./ui/index.jsx` file

We need to inject the `gameStore` dependency into `ContainerFactory`.

```Javascript
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    fluxtore = require('fluxtore'),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore);

// designed to be called once document is loaded.
module.exports = function(elementId) {
    var element = global.document.getElementById(elementId);

    ReactDOM.render(<Container />, element);
};
```

### Reuse components

Now we can try to dupicate our container

```Javascript
module.exports = function(elementId) {
    var element = global.document.getElementById(elementId);

    ReactDOM.render(<div><Container /> <Container /></div>, element);
};
```

### Update `./ui/components/square.jsx` component to use the gameStore

```Javascript
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
```

### Update `/ui/index.jsx` again

We need to inject `gameStore` dependency into `SquareFactory`

```Javascript
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    fluxtore = require('fluxtore'),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore);

// designed to be called once document is loaded.
module.exports = function(elementId) {
    var element = global.document.getElementById(elementId);

    ReactDOM.render(<Container />, element);
};
```

### The invalid move

When a user clicks a *Square* that can't be moved, we need to alert him. Lets modify the `./ui/components/square.jsx`.

```Javascript
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
```

And we will need to add a new style for the invalid move into the `./public/styles.css`

```CSS
.invalid {
    background: red;
}
```

### Remove responsibilites from Container

We have been adding a lot of functionality inside our container, lets split it a bit.

### Add a `reset` method to our `./ui/stores/gameStore.js`

```Javascript
actions: {
	tryMove: tryMove,
	random: random,
	reset: reset
}
```

```Javascript
function reset() {
	squares = initSquares();
	completed = false;
	store.emitChange();
	store.emitReset();
}
```

### Create the './ui/components/dashboard.jsx`

```Javascript
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
```

### Display the dashboard

Add a new `<div id="dashboard"/>` the `./index.html` file.

```Html
<!DOCTYPE html>
<html>
<head>
    <title>ReactJS Second Workshop</title>
    <link rel="stylesheet" type="text/css" href="public/styles.css">
    <script type="text/javascript" src="public/game.js"></script>
</head>
<body onload="rockandroll('container', 'dashboard')">
    <div id="dashboard">
        Dashboard....
    </div>
    <div id="container">Hello world!</div>
</body>
</html>
```

Add some styles to `./public/styles.css` file for the dashboard.

```CSS
#dashboard {
    text-align: center;
    margin-bottom: 40px;
}

#dashboard > div > span {
    margin: 0 10px;
}
```

Update the `./ui/index.jsx` file to use the *Dashboard*

```Javascript
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    fluxtore = require('fluxtore'),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore),
    DashboardFactory = require('./components/dashboard.jsx'),
    Dashboard = DashboardFactory(React, gameStore);

// designed to be called once document is loaded.
module.exports = function(containerId, dashboardId) {
    var containerElement = global.document.getElementById(containerId);
    var dashboardElement = global.document.getElementById(dashboardId);

    ReactDOM.render(<Container />, containerElement);
    ReactDOM.render(<Dashboard />, dashboardElement);
};
```

### Remove the random button from `./ui/components/container.jsx`

```Javascript
'use strict';

module.exports = function(React, _, Square, gameStore) {
    return React.createClass({
        displayName: 'Container',
    
        getInitialState: function() {
            return getGameState();
        },
    
        componentWillMount: function() {
            gameStore.addChangeListener(this.onGameStateChange);
        },
    
        componentWillUnmount: function() {
            gameStore.removeChangeListener(this.onGameStateChange);
        },
    
        onGameStateChange: function() {
            this.setState(getGameState());
        },
    
        createSquares: function(cols, rows) {                
            return _.map(this.state.squares, createSquare);
                
            function createSquare(number, index) {
                return number ? 
                    (<Square
                        number={number}
                        key={number}
                        index={index} 
                        cols={cols}/>) 
                    : null;
            }
        },
        
        render: function() {
            var cols = this.state.cols,
                rows = this.state.rows,
                sqWidth = this.state.squareWidth,
                sqHeight = this.state.squareHeight,
                squares = this.createSquares(cols, rows),
                style = {
                    width: (sqWidth * cols + 5) + 'px',
                    height: (sqHeight * rows + 50) + 'px'
                };
    
            return (
                <div className="container" style=
                    {style}>{squares}
                    <label>{this.state.completed ? 'Te la rifaste' : 'siguele dando'}</label>
                </div>
                );
        }
    });
    
    function getGameState() {
        return gameStore.getState();
    }
};
```

And remove the styles from `./public/styles.css` file.

```CSS
.container button {
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 40px;
}
```

### Time and Moves 

Lets watch how much time and how many moves user needs to complete. Remember what we did with our timer component?

We will borrow some of that code and use it inside the `./ui/components/dashboard.jsx`.

```Javascript
'use strict';

module.exports = function(React, moment, gameStore) {
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
				moves: 0
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
				timer: moment({hour: 0})
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

		getDisplayTime: function() {
			return this.state.timer.format('HH:mm:ss [elapsed]');
		},
		
		render: function() {
			return (
				<div>
					<span>Moves: {this.state.moves}</span>
					<span>Time elapsed: {this.getDisplayTime()}</span>
					<button onClick={this.resetClickHandler}>Reset</button>
					<button onClick={this.randomClickHandler}>Random</button>
				</div>)
		}
	});
	
	function getGameState() {
		return gameStore.getState();
	}
};
```

We need to update our `./ui/index.jsx` because we need to provide the **moment** dependency to *Dashboard*

```Javascript
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    fluxtore = require('fluxtore'),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore),
    DashboardFactory = require('./components/dashboard.jsx'),
    Dashboard = DashboardFactory(React, gameStore);

// designed to be called once document is loaded.
module.exports = function(containerId, dashboardId) {
    var containerElement = global.document.getElementById(containerId);
    var dashboardElement = global.document.getElementById(dashboardId);

    ReactDOM.render(<Container />, containerElement);
    ReactDOM.render(<Dashboard />, dashboardElement);
};
```

### Install the `moment` framework 

`npm install moment --save-dev`

### Levels of difficulty

Lets add the ability to our game to compute different solutions for the game.

### Create the levels

Create a `./ui/stores/levels/index.js` file.

```Javascript
'use strict';

module.exports = function(gameLevel1, gameLevel2) {
	return [gameLevel1, gameLevel2];
};
``` 

Create the first level `./ui/stores/levels/level-1.js`

```Javascript
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
```

And now the second level `./ui/stores/levels/level-2.js`

```Javascript
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
```

Lets inject the levels to our `./ui/stores/gameStore.js`.

```Javascript
'use strict';

module.exports = function(fluxtore, _, levels) {
	var store,
		currentLevel = levels[0],
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
```

Now on `./ui/index.jsx` file, we need to load and inject the levels.

```Javascript
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    moment = require('moment'),
    fluxtore = require('fluxtore'),
    level1Factory = require('./stores/levels/level-1'),
    level1 = level1Factory(_),
    level2Factory = require('./stores/levels/level-2'),
    level2 = level2Factory(_),
    levelsFactory = require('./stores/levels'),
    levels = levelsFactory(level1, level2),
    gameStoreFactory = require('./stores/gameStore'),
    gameStore = gameStoreFactory(fluxtore, _, levels),
    SquareFactory = require('./components/square.jsx'),
    Square = SquareFactory(React, gameStore),
    ContainerFactory = require('./components/container.jsx'),
    Container = ContainerFactory(React, _, Square, gameStore),
    DashboardFactory = require('./components/dashboard.jsx'),
    Dashboard = DashboardFactory(React, moment, gameStore);

// designed to be called once document is loaded.
module.exports = function(containerId, dashboardId) {
    var containerElement = global.document.getElementById(containerId);
    var dashboardElement = global.document.getElementById(dashboardId);

    ReactDOM.render(<Container />, containerElement);
    ReactDOM.render(<Dashboard />, dashboardElement);
};
```

Go and play with reset and random buttons, then change the `currentLevel = levels[1]` re-build and see what happen.

### Level switching

In our `./ui/stores/gameStore.js` we will provide functionality to access the list of available levels and which is the current one.

```Javascript
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
```

Now in our `./ui/components/dashboard.jsx` we can render a dropdown with the levels.

```Javascript
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
```

As `./ui/components/dashboard.jsx` now requires `underscore` as dependency, we need to feed it on `./ui/index.jsx`.

```Javascript
    Dashboard = DashboardFactory(React, moment, _, gameStore);
```
