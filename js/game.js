function initializeGame()
{
	// Initialize objects
	var testCircle0 = createGameObject("vert", "frag-circle", 0, 0, 100, 100);
	var testCircle1 = createGameObject("vert", "frag-circle", 100, 100, 100, 100);
	var testCircle2 = createGameObject("vert", "frag-circle", 200, 200, 100, 100);
	var testBox = createGameObject("vert", "frag-rect", 35, 35, 130, 30);
}

initializeGame();