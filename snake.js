(function() {
  if (window.Snake === undefined) {
    window.SnakeGame = {};
  }

 var Snake = SnakeGame.Snake = function () {
   this.segments = [Coord.generateRandom()];
   this.dir = "E";
   this.apples = [];
 }

 Snake.prototype.move = function () {
   var newSeg = new Coord(this.segments[0].plus(this.dir));
   this.segments.unshift(newSeg);

   if (!this.eatApple()) {
     var pos = this.segments.pop();
     this.eat = false
   } else {
     this.eat = true;
   }
   this.generateApple();
 };

 Snake.prototype.eatApple = function() {
   var apples = this.apples;
   for ( i = 0; i < apples.length; i++) {
     if (match(apples[i], this.segments[0])) {
       apples.splice(i, 1);
       return true;
     }
   }
   return false;
 }

 Snake.prototype.generateApple = function () {
   if( Math.random() > .8 && this.apples.length < 4 ) {
     this.apples.push(generateRandom());
   }
 }

 Snake.prototype.hit = function () {
   var hit = false
   var snake = this.segments;
   for( i = 1; i < snake.length; i++ ){
     if (match(snake[i], snake[0])) {
       hit = true;
     }
   }
   return hit;
 }

 Snake.prototype.turn = function (dir) {
   this.dir = dir;
 };

 Snake.DIR = ["N","E","S","W"];

 var Coord = SnakeGame.Coord = function (pos) {
   this.x = pos[0];
   this.y = pos[1];
 }

 var match = Coord.match = function (coord1, coord2){
  if (coord1.x === coord2.x && coord1.y === coord2.y) {
    return true
  }
  return false
 }

 Coord.prototype.plus = function (dir) {
   var addCoord = [];
   switch (dir) {
     case 'N':
       addCoord = [-1, 0];
       break;
     case 'E':
       addCoord = [0, 1];
       break;
     case 'S':
       addCoord = [1, 0];
       break;
     case 'W':
       addCoord = [0, -1];
       break;
   }
   return [this.x + addCoord[0], this.y + addCoord[1]];
 }

 var generateRandom = Coord.generateRandom = function (){
   var x = Math.floor(Math.random() * (Board.DIM_X - 1));
   var y = Math.floor(Math.random() * (Board.DIM_Y - 1));
   return new Coord([x,y]);
 }

 var Board = SnakeGame.Board = function () {
   this.snake = new Snake();
   this.grid = this.setUpBoard();
   this.apples = [];
 }

 Board.DIM_X = 20;
 Board.DIM_Y = 15;

Board.prototype.setUpBoard = function () {
  var grid = [];
  for (var i = 0; i < Board.DIM_X; i++) {
    grid.push([]);
    for (var j = 0; j < Board.DIM_Y; j++) {
      grid[i].push(".");
    }
  }
  return grid;
};

Board.prototype.gameOver = function () {
  var over = false
  this.snake.segments.forEach(function(el){
    if( (el.y < 0) || (el.y > Board.DIM_Y - 1) ){
      over = true;
    }
    if( (el.x < 0) || (el.x > Board.DIM_X - 1) ){
      over = true;
    }
  })
  if (this.snake.hit()) {
    over = true;
  }
  return over;
}

Board.prototype.render = function () {
  var grid = this.grid;
  var gridString = ""
  for (var i = 0; i < Board.DIM_X; i++) {
    for (var j = 0; j < Board.DIM_Y; j++) {
      grid[i][j] = ".";
    }
  }
  this.snake.segments.forEach(function (el){
    grid[el.x][el.y] = "s";
  })
  for (var i = 0; i < Board.DIM_X; i++) {
    for (var j = 0; j < Board.DIM_Y; j++) {
      gridString += grid[i][j];
    }
    gridString += "\n";
  }
}

})();
