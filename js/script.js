const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let score = 0;
let snake;
let food;

document.addEventListener('keydown', direction);

function init() {
  snake = new Snake();
  food = new Food();
  score = 0;
  window.clearInterval(game);
  game = setInterval(update, 100);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  snake.draw();
  food.draw();

  if (snake.eat(food)) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
    food = new Food();
  }

  if (snake.collide()) {
    init();
  }
}

function direction(event) {
  const keyPressed = event.keyCode;

  if (keyPressed === 37 && snake.direction !== 'RIGHT') {
    snake.changeDirection('LEFT');
  } else if (keyPressed === 38 && snake.direction !== 'DOWN') {
    snake.changeDirection('UP');
  } else if (keyPressed === 39 && snake.direction !== 'LEFT') {
    snake.changeDirection('RIGHT');
  } else if (keyPressed === 40 && snake.direction !== 'UP') {
    snake.changeDirection('DOWN');
  }
}

function Snake() {
  this.body = [{ x: 10, y: 10 }];
  this.direction = 'RIGHT';

  this.move = function() {
    let head = { ...this.body[0] };

    if (this.direction === 'LEFT') head.x -= 1;
    if (this.direction === 'UP') head.y -= 1;
    if (this.direction === 'RIGHT') head.x += 1;
    if (this.direction === 'DOWN') head.y += 1;

    this.body.unshift(head);
    this.body.pop();
  };

  this.changeDirection = function(newDirection) {
    this.direction = newDirection;
  };

  this.eat = function(food) {
    const head = this.body[0];

    if (head.x === food.x && head.y === food.y) {
      this.body.push({});
      return true;
    }
    return false;
  };

  this.collide = function() {
    const head = this.body[0];

    if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows) {
      return true;
    }

    for (let i = 1; i < this.body.length; i++) {
      if (this.body[i].x === head.x && this.body[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  this.draw = function() {
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = i === 0 ? '#00FF00' : '#00CC00';
      ctx.fillRect(this.body[i].x * scale, this.body[i].y * scale, scale, scale);
    }
  };
}

function Food() {
  this.x = Math.floor(Math.random() * columns);
  this.y = Math.floor(Math.random() * rows);

  this.draw = function() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
  };
}

let game = setInterval(update, 100);

init();
