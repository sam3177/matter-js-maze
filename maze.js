const {World, Bodies } = Matter;
const [ width, height ] = [ innerWidth, innerHeight - 10 ];

const maze = (world, rows = 5, cols = 5) => {
	let cellWidth = width / cols;
	let cellHeight = height / rows;

	//cells generator
	let maze = Array(rows).fill(null).map(() => Array(cols).fill(false));

	// verticals generator
	let verticals = Array(rows).fill(null).map(() => Array(cols - 1).fill(false));

	//horizontals generator
	let horizontals = Array(rows - 1)
		.fill(null)
		.map(() => Array(cols).fill(false));

	//random starting cell
	let rRow = Math.floor(Math.random() * rows);
	let rCol = Math.floor(Math.random() * cols);

	//shuffle fn
	const shuffle = (arr) => {
		let len = arr.length;
		while (len > 0) {
			const randIdx = Math.floor(Math.random() * len);
			len--;
			[ arr[len], arr[randIdx] ] = [ arr[randIdx], arr[len] ];
		}
		return arr;
	};

	//the function who makes the maze
	const makeMaze = (row, col) => {
		// return if already visited
		if (maze[row][col]) return;
		//change to visited
		maze[row][col] = true;
		// generate and randomize neighbors
		const neighbors = shuffle([
			[ row - 1, col, 'up' ],
			[ row, col + 1, 'right' ],
			[ row + 1, col, 'down' ],
			[ row, col - 1, 'left' ]
		]);
		// iterate thru each neighbor
		for (let neighbor of neighbors) {
			const [ nextRow, nextCol, direction ] = neighbor;
			//check if out of bounds and if is already visited (if is true)
			const isOutOfBounds =
				nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols;
			if (isOutOfBounds || maze[nextRow][nextCol]) continue;
			//remove the wall between the actual and next cell
			if (direction === 'right') verticals[row][col] = true;
			if (direction === 'left') verticals[nextRow][nextCol] = true;
			if (direction === 'down') horizontals[row][col] = true;
			if (direction === 'up') horizontals[nextRow][nextCol] = true;
			//call again the fn
			makeMaze(nextRow, nextCol);
		}
	};
   makeMaze(rRow, rCol);
   
   verticals.map((column, i) => {
      column.map((wall, j) => {
         !wall &&
            World.add(
               world,
               Bodies.rectangle(
                  cellWidth * (j + 1),
                  cellHeight / 2 * (i * 2 + 1),
                  5,
                  cellHeight + 5,
                  {
                     isStatic : true,
                     label: 'wall',
                     render   : {
                        fillStyle : 'red'
                     }
                  }
               )
            );
      });
   });
   horizontals.map((row, i) => {
      row.map((wall, j) => {
         !wall &&
            World.add(
               world,
               Bodies.rectangle(
                  cellWidth / 2 * (j * 2 + 1),
                  cellHeight * (i + 1),
                  cellWidth + 5,
                  5,
                  {
                     isStatic : true,
                     label: 'wall',
                     render   : {
                        fillStyle : 'red'
                     }
                  }
               )
            );
      });
   });
   //create and add target to the world
   const target = Bodies.rectangle(
      width - cellWidth / 2,
      height - cellHeight / 2,
      cellWidth / 1.5,
      cellHeight / 1.5,
      {
         isStatic : true,
         label    : 'target',
         render   : {
            fillStyle : 'rgb(0, 255, 13)'
         }
      }
   );
   World.add(world, target);
   
   // create and add ball
   const minDiam = Math.min(cellWidth, cellHeight)
   const ball = Bodies.circle(cellWidth / 2, cellHeight / 2, minDiam / 3, {
      label : 'ball'
   });
   World.add(world, ball);
   return ball
};


export {width, height, maze}