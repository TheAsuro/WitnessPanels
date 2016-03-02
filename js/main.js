// Initialize canvas
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl");

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

function initialize()
{
	// Load shaders
	var vertexShader = loadShaderFromId("vert", gl.VERTEX_SHADER);
	var fragmentShader = loadShaderFromId("frag-cicle", gl.FRAGMENT_SHADER);
	var shader = loadShaderProgram(vertexShader, fragmentShader);

	// Initialize objects
	var texCoords = loadFloatArrayBuffer(shader, createTextureCoordArray(), "a_uv");
	var worldCoords = loadFloatArrayBuffer(shader, createRectangleArray(0,0,1,1), "a_position");
}

initialize();

// Draw
gl.drawArrays(gl.TRIANGLES, 0, 6);