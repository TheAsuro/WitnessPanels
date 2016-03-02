// Initialize canvas
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl");

var drawQueue = [];

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

function loadShaderProgram(vert, frag)
{
	var program = gl.createProgram();
	gl.attachShader(program, vert);
	gl.attachShader(program, frag);
	gl.linkProgram(program);
	gl.useProgram(program);

	return program;
}

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

function createRectObject(vertId, fragId, x, y, width, height)
{
	var vs = loadShaderFromId(vertId, gl.VERTEX_SHADER);
	var fs = loadShaderFromId(fragId, gl.FRAGMENT_SHADER);
	var shader = loadShaderProgram(vs, fs);

	var resolutionPointer = gl.getUniformLocation(shader, "u_resolution");
	gl.uniform2f(resolutionPointer, canvas.width, canvas.height);

	return {
		vertexShader: vs,
		fragmentShader: fs,
		shader: shader,
		texCoords: loadFloatArrayBuffer(shader, createTextureCoordArray(), "a_uv"),
		worldCoords: loadFloatArrayBuffer(shader, createRectangleArray(x, y, width + x, height + y), "a_position"),
		xPos: x,
		yPos: y,
		width: width,
		height: height
	}
}

function draw()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	for (var key in drawQueue)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, drawQueue[key].worldCoords);

		var bufferPointer = gl.getAttribLocation(drawQueue[key].shader, "a_position");
		gl.enableVertexAttribArray(bufferPointer);
		gl.vertexAttribPointer(bufferPointer, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	
	window.requestAnimationFrame(draw);
}

function initialize()
{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Initialize objects
	var testCircle0 = createRectObject("vert", "frag-circle", 0, 0, 100, 100);
	var testCircle1 = createRectObject("vert", "frag-circle", 100, 100, 100, 100);
	var testCircle2 = createRectObject("vert", "frag-circle", 200, 200, 100, 100);

	drawQueue = [testCircle0, testCircle1, testCircle2];

	draw();
}

initialize();