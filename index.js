import { width, height, maze } from './maze.js';
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		width,
		height,
		wireframes : false
		// background : 'url(Confetti.svg)'
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

const createCanvas = () => {
	//walls
	engine.world.gravity.y = 0;

	const walls = [
		Bodies.rectangle(width / 2, 0, width, 2, {
			isStatic : true,
			render   : { fillColor: 'white' }
		}),
		Bodies.rectangle(width / 2, height, width, 2, {
			isStatic : true,
			render   : { fillColor: 'white' }
		}),
		Bodies.rectangle(0, height / 2, 2, height, {
			isStatic : true,
			render   : { fillColor: 'white' }
		}),
		Bodies.rectangle(width, height / 2, 2, height, {
			isStatic : true,
			render   : { fillColor: 'white' }
		})
	];
	World.add(world, walls);
	return { world, engine };
};

// //maze generator
// let rows = 10;
// let cols = 14;
createCanvas();
let ball = maze(world);

document.getElementById('reset').addEventListener('click', (e) => {
	e.preventDefault();
	const rows = parseInt(document.getElementById('rows').value) || 5;
	const cols = parseInt(document.getElementById('cols').value) || 5;
	document.querySelector('.win').classList.add('hidden');
	World.clear(engine.world);
	Engine.clear(engine);
	createCanvas();
	document.getElementById('rows').value = '';
	document.getElementById('cols').value = '';
	ball = maze(world, rows, cols);
});

document.addEventListener('keydown', (e) => {
	const { x, y } = ball.velocity;
	if (e.code === 'KeyW') {
		Body.setVelocity(ball, { x, y: y - 3 });
	}
	if (e.code === 'KeyD') {
		Body.setVelocity(ball, { x: x + 3, y });
	}
	if (e.code === 'KeyS') {
		Body.setVelocity(ball, { x, y: y + 3 });
	}
	if (e.code === 'KeyA') {
		Body.setVelocity(ball, { x: x - 3, y });
	}
});

Events.on(engine, 'collisionStart', (e) => {
	console.log(e);
	const { bodyA, bodyB } = e.pairs[0];
	const labels = [ 'ball', 'target' ];
	console.log(bodyA, bodyB);
	if (labels.includes(bodyA.label) && labels.includes(bodyB.label)) {
		console.log('Congrats, you won!');
		engine.world.gravity.y = 0.5;
		e.source.world.bodies.map((item) => {
			item.label === 'wall' && Body.setStatic(item, false);
		});
		const rowsSelect = document.getElementById('rows');
      const colsSelect = document.getElementById('cols');
      rowsSelect.innerHTML = ''
      colsSelect.innerHTML = ''
		for (let i = 3; i <= 50; i++) {
			const rowOption = document.createElement('option');
			const colOption = document.createElement('option');
			rowOption.value = i;
			rowOption.innerText = i;
			colOption.value = i;
			colOption.innerText = i;
			i === 4 && console.log(rowOption.setAttribute('selected', 'selected'));
			i === 4 && console.log(colOption.setAttribute('selected', 'selected'));
			rowsSelect.append(rowOption);
			colsSelect.append(colOption);
			document.querySelector('.win').classList.remove('hidden');
		}
	}
});
