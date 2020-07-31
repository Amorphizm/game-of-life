var cells = document.querySelectorAll(".grid-item");
var buttons = document.getElementsByTagName("button");
var gen_label = document.getElementById("generation");
var pop_label = document.getElementById("population");
var generation = parseInt(gen_label.placeholder);
document.getElementById("stop").disabled = true;
var matrix = [];
let count = 0;

// iterate over the matrix and add the cells
for (i = 0; i < 20; i++) {
  matrix[i] = new Array(20);
  let o = 0;
  status = 'inactive';
  while (o < matrix[i].length) {
    let cell = [count, cells[count], status]
    cell[1].classList.add('inactive');
    cell[1].addEventListener("click", function () {
      changeStatus(cell);
    });
    matrix[i][o] = cell;
    count++;
    o++;
  }
}

// iterate over the buttons and add event listener functions
for (i = 0; i < buttons.length; i++) {
  let button = buttons[i];
  if (button.id == 'random') {
    button.addEventListener("click", function () {
      randomize(matrix);
    });
  } else if (button.id == 'start') {
    button.addEventListener("click", function () {
      button.disabled = true;
      document.getElementById("stop").disabled = false;
      return game_interval = start_game(matrix, generation, gen_label, pop_label);
    });
  } else if (button.id == 'stop') {
    button.addEventListener("click", function () {
      button.disabled = true;
      document.getElementById("start").disabled = false;
      stop_game(game_interval, gen_label);
    });
  } else if (button.id == 'clear') {
    button.addEventListener("click", function() {
      stop_game(game_interval, gen_label);
      clear_game(matrix);
      changeClass(matrix);
      generation = 0;
      gen_label.placeholder = '0';
      pop_label.placeholder = '0';
      document.getElementById("start").disabled = false;
      document.getElementById("stop").disabled = true;
    });
  }
}

// sets ever cell's third element to inactive
function clear_game(matrix) {
  let i = 0;
  while (i < matrix.length) {
    let o = 0;
    while (o < matrix[i].length) {
      cell = matrix[i][o];
      cell[2] = 'inactive';
      o++;
    }
    i++;
  }
}

// stops the interval and saves the previous generation count
// by storing it within the gen_label's placeholder
function stop_game(start, gen_label) {
  generation = gen_label.placeholder;
  gen_label.placeholder = generation;
  clearInterval(start);
}

// starts the game interval and returns the interval so it can be stopped
// in the stop_game function
function start_game(matrix, generation, gen_label, pop_label) {
  var start = setInterval( function() {
    updateCells(matrix);
    var population = changeClass(matrix);
    console.log(population);
    generation++;
    gen_label.placeholder = generation.toString();
    pop_label.placeholder = population.toString();

  }, 500);
  return start;
}

// iterates over the cells and changes their class based on their current status
// which is set in cell[2] and returns the population count for that generation
function changeClass(matrix) {
  let population = 0;
  let i = 0;
  while (i < matrix.length) {
    let o = 0;
    while (o < matrix[i].length) {
      cell = matrix[i][o];
      if (cell[1].classList.contains('inactive') && cell[2] == 'active') {
        cell[1].classList.remove('inactive');
        cell[1].classList.add('active');
        population++;
      } else if (cell[1].classList.contains('active') && cell[2] == 'inactive') {
        cell[1].classList.remove('active');
        cell[1].classList.add('inactive');
      } else if (cell[1].classList.contains('active')) {
        population++;
      }
      o++;
    }
    i++;
  }
  return population;
}

// checks the cell's neighbors and update's their status based off of the neighbor's collective statuses
function checkNeighbors(cell, neighbors) {
  var active_count = 0;
  for (i = 0; i < neighbors.length; i++) {
    if (neighbors[i] != undefined) {
      if (neighbors[i][1].classList.contains('active')) {
        active_count++;
      }
    } 
  }
  if (cell[2] == 'active' && active_count < 2 || active_count > 3) {
    cell[2] = 'inactive';
  } else if (cell[2] == 'inactive' && active_count == 3) {
    cell[2] = 'active';
  }
}

// gets the neighbor cells positions and passes those into the checkNeighbors function
function updateCells(matrix) {
  let i = 0;
  while (i < matrix.length) {
    let o = 0;
    while (o < matrix[i].length) {
      var top = matrixGet(matrix, i-1, o);
      var top_left = matrixGet(matrix, i-1, o-1);
      var bottom_left = matrixGet(matrix, i+1, o-1);
      var top_right = matrixGet(matrix, i-1, o+1);
      var bottom_right = matrixGet(matrix, i+1, o+1);
      var bottom = matrixGet(matrix, i+1, o);
      var left = matrixGet(matrix, i, o-1);
      var right = matrixGet(matrix, i, o+1);
      var neighbors = new Array(right, bottom, top, left, top_left, top_right, bottom_left, bottom_right);
      checkNeighbors(matrix[i][o], neighbors);
      o++;
    }
    i++;
  }
}

// checks the bounds of all neighbors
function matrixGet(arr, i, o) {
  if (i < 0 || i > 19) {
    return undefined;
  } else if (o < 0 || o > 19) {
    return undefined;
  } else {
    return arr[i][o];
  }
}

// iterates over every cell and 
function randomize(matrix) {
  var statuses = ['active', 'inactive']
  let i = 0;
  while (i < matrix.length) {
    let o = 0;
    while (o < matrix[i].length) {
      var status = statuses[Math.floor(Math.random() * statuses.length)];
      if (status == 'active') {
        matrix[i][o][1].classList.remove('inactive');
        matrix[i][o][1].classList.add('active');
      }
      o++;
    }
    i++;
  }
}

// changes the cell's status, used within an event listener for each cell on whether that cell
// was clicked or not
function changeStatus(cell) {
  if (cell[1].classList.contains('inactive')) {
    cell[1].classList.remove('inactive');
    cell[1].classList.add('active');
    cell[2] = 'active';
  } else {
    cell[1].classList.add('inactive');
    cell[1].classList.remove('active');
    cell[2] = 'inactive';
  }
}
