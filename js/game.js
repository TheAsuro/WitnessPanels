const gridSize = 100.0;
const startSize = 80.0;
const connectionThickness = 30.0;
const connectionLength = 50.0;

var DIRECTION = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3
}

function createStart(x, y)
{
	var startOffset = (gridSize - startSize) / 2;
	var obj = createGameObject(
				"vert",
				"frag-circle",
				x * gridSize + startOffset,
				y * gridSize + startOffset,
				startSize,
				startSize
	 );
	obj.attributes.u_fill = {type: ATTRIBUTE_TYPE.FLOAT, value: 0.0};
	obj.clickEvents.push(function() { obj.attributes.u_fill.value = 1; });
	return obj;
}

function createConnection(x, y, direction)
{
	var xPos;
	var yPos;
	var width;
	var height;

	switch (direction)
	{
		case DIRECTION.LEFT:
			xPos = x * gridSize;
			yPos = y * gridSize + gridSize / 2.0 - connectionThickness / 2.0;
			width = connectionLength;
			height = connectionThickness;
			break;
		case DIRECTION.RIGHT:
			xPos = x * gridSize + gridSize / 2.0;
			yPos = y * gridSize + gridSize / 2.0 - connectionThickness / 2.0;
			width = connectionLength;
			height = connectionThickness;
			break;
		case DIRECTION.UP:
			xPos = x * gridSize + gridSize / 2.0 - connectionThickness / 2.0;
			yPos = y * gridSize + gridSize / 2.0;
			width = connectionThickness;
			height = connectionLength;
			break;
		case DIRECTION.DOWN:
			xPos = x * gridSize + gridSize / 2.0 - connectionThickness / 2.0;
			yPos = y * gridSize;
			width = connectionThickness;
			height = connectionLength;
			break;
		default:
			alert("Error! Invalid direction.");
	}
	

	var obj = createGameObject("vert", "frag-rect", xPos, yPos, width, height);
	obj.attributes.u_fill = {type: ATTRIBUTE_TYPE.FLOAT, value: 0.0};
	obj.attributes.u_fillDirection = { type: ATTRIBUTE_TYPE.INT, value: direction };
	obj.clickEvents.push(function() { obj.attributes.u_fill.value += 0.1; });
	return obj;
}

function initializeGame()
{
	// Initialize objects
	var con1 = createConnection(0, 0, DIRECTION.RIGHT);
	var con2 = createConnection(1, 0, DIRECTION.LEFT);
	var con3 = createConnection(1, 0, DIRECTION.RIGHT);
	var con4 = createConnection(2, 0, DIRECTION.LEFT);
	var con5 = createConnection(2, 0, DIRECTION.UP);
	var con6 = createConnection(2, 1, DIRECTION.DOWN);
	var con7 = createConnection(2, 1, DIRECTION.UP);
	var con8 = createConnection(2, 1, DIRECTION.LEFT);
	var con9 = createConnection(2, 1, DIRECTION.RIGHT);
	var start = createStart(0, 0);
}

initializeGame();