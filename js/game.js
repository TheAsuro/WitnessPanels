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

function createGameObject(vertId, fragId, x, y, width, height, clickEvent)
{
	var obj = createRectObject(vertId, fragId, x, y, width, height);
	obj.clickEvent = clickEvent;
	drawQueue.push(obj);
}

canvas.addEventListener("click", function(event)
{
	var x = canvas.relMouseCoords(event).x;
	var y = canvas.relMouseCoords(event).y;

	for (var key in drawQueue)
	{
		if (drawQueue[key].x <= x && x <= drawQueue[key].x + drawQueue[key].width
			&& (canvas.height - drawQueue[key].y) - drawQueue[key].height <= y && y <= (canvas.height - drawQueue[key].y))
		{
			if (drawQueue[key].clickEvent !== undefined)
			{
				drawQueue[key].clickEvent();
			}
		}
	}
});

function initializeGame()
{
	// Initialize objects
	var testCircle0 = createGameObject("vert", "frag-circle", 0, 0, 100, 100, function() {alert("test");});
	var testCircle1 = createGameObject("vert", "frag-circle", 100, 100, 100, 100);
	var testCircle2 = createGameObject("vert", "frag-circle", 200, 200, 100, 100);
}

initializeGame();