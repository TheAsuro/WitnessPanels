var selectedObject;

function initializeGame()
{
	// Initialize objects
	var testCircle0 = createGameObject("vert", "frag-circle", 0, 0, 100, 100, function() {
		testCircle0.attributes.u_select.value = 1;
	});
	testCircle0.attributes.u_select = {type: ATTRIBUTE_TYPE.INT, value: 0};
	var testCircle1 = createGameObject("vert", "frag-circle", 100, 100, 100, 100);
	var testCircle2 = createGameObject("vert", "frag-circle", 200, 200, 100, 100);
	var testBox = createGameObject("vert", "frag-rect", 50, 35, 100, 30);
}

initializeGame();