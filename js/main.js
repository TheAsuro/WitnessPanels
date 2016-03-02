// Initialize canvas
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl");

// Initialize shaders
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

function createTextureCoords()
{
	return new Float32Array([
        // Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0
    ]);
}

function loadVertexBuffer(shaderProgram, vertArray)
{
	var resolutionPointer = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform2f(resolutionPointer, canvas.width, canvas.height);

	var positionArrayPointer = gl.getAttribLocation(shaderProgram, "a_position");
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionArrayPointer);
	gl.vertexAttribPointer(positionArrayPointer, 2, gl.FLOAT, false, 0, 0);

	return positionArrayPointer;
}

function initialize()
{
	var vertexShader = loadShaderFromId("vert", gl.VERTEX_SHADER);
	var fragmentShader = loadShaderFromId("frag-cicle", gl.FRAGMENT_SHADER);
	var shader = loadShaderProgram(vertexShader, fragmentShader);
	var testobj = loadVertexBuffer(shader, createRectangleArray(-1,-1,1,1));
}

initialize();

// Draw
gl.drawArrays(gl.TRIANGLES, 0, 6);