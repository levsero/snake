(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function (game, $el, speed) {
    this.game = game;
    this.$el = $el;

    this.$figure = $el.find("figure");
    this.$score = $el.find("score");
    this.score = 0;

    this.bindEvents();
    this.setupBoard();

    this.timer = null;
    this.over = false;
    this.speed = speed;
  };

  View.prototype.start = function() {
    var view = this;
    var p = this.$el.find("p.message");
    $($.find("button")).prop("disabled", true);
    view.render();

    p.addClass("transparent")

    p.html(3);
    setTimeout( function () {
      p.html(2);
      setTimeout( function () {
        p.html(1);
        setTimeout( function () {
          p.removeClass("transparent");
          p.addClass("none")
          view.timers();
        }, 1000)
      }, 1000)
    }, 1000)
  };

  View.prototype.timers = function () {
    var view = this;
    var p = this.$el.find("p.message")
    $($.find("button")).prop("disabled", false);

    var timer = setInterval( function () {
      view.game.snake.move();
      view.timer = timer;

      if (view.game.snake.eat) {
        view.updateScore();
      }

      if (view.game.gameOver()) {
        view.updateHighScore();
        p.text("Game Over").removeClass("none")
        clearInterval(timer);

      } else if (!view.over) {
        view.render();
      }
    }, this.speed);
  }

  View.prototype.gameOver = function () {
    clearInterval(this.timer);
    this.over = true;
  }

  View.prototype.render = function () {
    renderSnake(this);
    renderApples(this)
  }

  var renderSnake = function (view) {
    var arr = view.game.snake.segments;
    view.$figure.find("li").removeClass("snake");
    for(i = 0; i < arr.length; i++){
      var idx = (arr[i].x * SnakeGame.Board.DIM_Y) + (arr[i].y)
      var $snake = view.$figure.find("li").eq(idx);
      $snake.addClass("snake");
    }
  }

  var renderApples = function (view) {
    var arr = view.game.snake.apples;
    view.$figure.find("li").removeClass("apple");
    for(i = 0; i < arr.length; i++){
      var idx = (arr[i].x * SnakeGame.Board.DIM_Y) + (arr[i].y)
      var $apple = view.$figure.find("li").eq(idx);
      $apple.addClass("apple");
    }
  }

  View.prototype.updateScore = function () {
    this.score++;
    this.$el.find("score").html(this.score);

    var highScore = Number(this.$el.find("high").html())
    if (this.score < highScore) {
      this.$figure.find(".message").html(highScore - this.score);
    } else {
      this.$figure.find(".message").html("New High Score!");
    }
  }

  View.prototype.updateHighScore = function () {
    var highScore = Number(this.$el.find("high").html())

    if (this.score > highScore) {
      this.$el.find("high").html(this.score)
    }
  }

  View.prototype.setupBoard = function ( ) {
    var html = "<ul class='grid group'>"
    for (var i = 0; i < SnakeGame.Board.DIM_X; i++) {
      for (var j = 0; j < SnakeGame.Board.DIM_Y; j++) {
        html += "<li></li>"
      }
    }

    html += '<div class="modal"><p class="message">Let\'s play</p>' +
    '<input type="radio" name="dif" value="150">Easy' +
    '<input type="radio" name="dif" value="100" checked="checked">Medium' +
    '<input type="radio" name="dif" value="50">Hard</div>' +
    '</ul>';
    this.$figure.html(html);

    this.score = 0;
    this.$score.html(0);
  };

  View.prototype.bindEvents = function () {
    var view = this;
    $(document).on("keydown", function(event){
      event.preventDefault();
      view.snakeTurn(event.which);
    })
  };

  View.prototype.snakeTurn = function(code) {
    if(code === 37){
      this.game.snake.turn("W");
    } else if (code === 38) {
      this.game.snake.turn("N");
    } else if (code === 39) {
      this.game.snake.turn("E");
    } else if (code === 40) {
      this.game.snake.turn("S");
    }
  };

})();
