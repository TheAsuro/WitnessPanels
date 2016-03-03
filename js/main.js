// Initialize canvas
var canvas = document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var gl = canvas.getContext("webgl", { alpha: false, antialias: true });
window.addEventListener("resize", function(event) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
});
canvas.addEventListener("mousemove", function(event) {
	mousePos = canvas.relMouseCoords(event);
});

var drawQueue = [];
var mousePos = {x: 0, y: 0};

// Attribute type definitions
ATTRIBUTE_TYPE = {
	INT: 0,
	FLOAT: 1,
	FLOAT2: 2
}

// Loads shader from html and compiles it
function loadShaderFromId(id, type)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, document.getElementById(id).innerHTML);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

// Combines shaders into a shader program
function loadShaderProgram(vert, frag)
{
	var program = gl.createProgram();
	gl.attachShader(program, vert);
	gl.attachShader(program, frag);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(program));
		return null;
	}

	gl.useProgram(program);

	return program;
}

// Returns an array with the coordinates of a rectangle
function createRectangleArray(minX, minY, maxX, maxY)
{
	return new Float32Array([
        minX, minY,
	    maxX, minY,
	    minX, maxY,
	    minX, maxY,
	    maxX, minY,
	    maxX, maxY
    ]);
}

// Returns an array with the default texture coordinates
function createTextureCoordArray()
{
	return new Float32Array([
		-1.0, -1.0,
		1.0, -1.0,
		-1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		1.0, 1.0
    ]);
}

// Loads an array to a buffer on the graphics card
function loadFloatArrayBuffer(shaderProgram, array, varName)
{
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

	var bufferPointer = gl.getAttribLocation(shaderProgram, varName);
	gl.enableVertexAttribArray(bufferPointer);
	gl.vertexAttribPointer(bufferPointer, 2, gl.FLOAT, false, 0, 0);

	return buffer;
}

// Creates a game object
function createRectObject(vertId, fragId, x, y, width, height)
{
	var vs = loadShaderFromId(vertId, gl.VERTEX_SHADER);
	var fs = loadShaderFromId(fragId, gl.FRAGMENT_SHADER);
	var shader = loadShaderProgram(vs, fs);

	var obj = {
		vertexShader: vs,
		fragmentShader: fs,
		shader: shader,
		attributes: {},
		texCoords: loadFloatArrayBuffer(shader, createTextureCoordArray(), "a_uv"),
		worldCoords: loadFloatArrayBuffer(shader, createRectangleArray(x, y, width + x, height + y), "a_position"),
		x: x,
		y: y,
		width: width,
		height: height
	}

	obj.attributes.u_resolution = {
		type: ATTRIBUTE_TYPE.FLOAT2,
		value: {x: canvas.width, y: canvas.height}
	};

	return obj;
}

function relMouseCoords(event)
{
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do
    {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function createGameObject(vertId, fragId, x, y, width, height)
{
	var obj = createRectObject(vertId, fragId, x, y, width, height);
	obj.clickEvents = [];
	obj.updateEvents = [];
	drawQueue.push(obj);

	return obj;
}

// Run click events for game objects
canvas.addEventListener("click", function(event)
{
	var x = canvas.relMouseCoords(event).x;
	var y = canvas.relMouseCoords(event).y;

	for (var key in drawQueue)
	{
		if (drawQueue[key].x <= x && x <= drawQueue[key].x + drawQueue[key].width
			&& (canvas.height - drawQueue[key].y) - drawQueue[key].height <= y && y <= (canvas.height - drawQueue[key].y))
		{
			for (var eventKey in drawQueue[key].clickEvents)
			{
				drawQueue[key].clickEvents[eventKey]();
			}
		}
	}
});

// Main draw loop
function draw()
{
	// Update objects
	for (var key in drawQueue)
	{
		if (drawQueue[key].updateEvents != undefined)
		{
			for (var updateKey in drawQueue[key].updateEvents)
			{
				drawQueue[key].updateEvents[updateKey]();
			}
		}
	}

	// Clear everything before rendering
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw every object in the queue
	for (var key in drawQueue)
	{
		// Load shader
		gl.useProgram(drawQueue[key].shader);

		// Load object coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, drawQueue[key].worldCoords);

		// Supply variables to the shader
		for (var attrName in drawQueue[key].attributes)
		{
			var attribPointer = gl.getUniformLocation(drawQueue[key].shader, attrName);
			var value = drawQueue[key].attributes[attrName].value;

			switch (drawQueue[key].attributes[attrName].type)
			{
				case ATTRIBUTE_TYPE.INT:
					gl.uniform1i(attribPointer, value); break;
				case ATTRIBUTE_TYPE.FLOAT:
					gl.uniform1f(attribPointer, value); break;
				case ATTRIBUTE_TYPE.FLOAT2:
					gl.uniform2f(attribPointer, value.x, value.y); break;
				default:
					alert("Error: unknown attribute type!");
			}
		}

		var bufferPointer = gl.getAttribLocation(drawQueue[key].shader, "a_position");
		gl.enableVertexAttribArray(bufferPointer);
		gl.vertexAttribPointer(bufferPointer, 2, gl.FLOAT, false, 0, 0);

		// Run shaders and draw
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	window.requestAnimationFrame(draw);
}

function initialize()
{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	draw();
}

initialize();