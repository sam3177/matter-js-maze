const {
	Engine,
	Render,
	Runner,
	World,
	Bodies,
	Mouse,
	MouseConstraint
} = Matter;

const engine = Engine.create();
const { world } = engine;
const [ width, height ] = [ 1000, 800 ];
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		width,
		height,
		wireframes : false
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);
World.add(
	world,
	MouseConstraint.create(engine, {
		mouse : Mouse.create(render.canvas)
	})
);

//walls
const walls = [
	Bodies.rectangle(500, 0, 1000, 10, { isStatic: true }),
	Bodies.rectangle(500, 800, 1000, 10, { isStatic: true }),
	Bodies.rectangle(0, 400, 10, 800, { isStatic: true }),
	Bodies.rectangle(1000, 400, 10, 800, { isStatic: true })
];
World.add(world, walls);

//random shapes
for (let i = 0; i < 80; i++) {
	let rand = Math.random();
	if (rand < 0.5) {
		World.add(
			world,
			Bodies.rectangle(
				Math.random() * width,
				Math.random() * height,
				100,
				50
				// { isStatic: true }
			)
		);
	}
	else {
		World.add(
			world,
			Bodies.circle(
				Math.random() * width,
				Math.random() * height,
            20,
            {
               render: {
                  fillStyle:'pink'
               }
            }
				// { isStatic: true }
			)
		);
	}
}
