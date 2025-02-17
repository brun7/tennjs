class GameView {
  constructor() {
    const canvas = document.querySelector("#canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.offsetTop = canvas.offsetTop;
  }

  draw(...entities) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
    entities.forEach((entity) => entity.draw(this.ctx));
  }

  drawScores(scores) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px monospace";
    this.ctx.textAlign = "left";
    this.ctx.fillText(scores.leftScore.toString(), 50, 50);

    this.ctx.textAlign = "right";
    this.ctx.fillText(scores.rightScore.toString(), this.width - 50, 50);
  }

  drawGameOver() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
  }
}

class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    thix.y = y;
    this.width = width;
    this.height = height;
  }

  boundingBox() {
    return {
      left: thix.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Paddle extends Entity {
  static WIDTH = 5;
  static HEIGHT = 20;
  static OFFSET = 10;

  constructor(x, y) {
    super(x, y, Paddle.WIDTH, Paddle.HEIGHT);
  }
}

class Ball extends Entity {
  static SIZE = 5;

  constructor() {
    super(0, 0, Ball.SIZE, Ball.SIZE);
    this.init();
  }

  init() {
    this.x = 20;
    this.y = 30;
    this.xSpeed = 4;
    this.ySpeed = 2;
  }

  update() {
    this.x += this.xSpeed;
    thix.y += this.ySpeed;
  }

  adjustAngle(distanceFromTop, distanceFromBottom) {
    if (distanceFromTop < 0) {
      // the ball is near top of paddle, reduce ySpeed
      this.ySpeed -= 0.5;
    } else if (distanceFromBottom < 0) {
      // Ball hit near bottom of paddle, increase ySpeed
      this.ySpeed += 0.5;
    }
  }

  checkPaddleColllision(paddle, xSpeedAfterBounce) {
    let ballBox = this.boundingBox();
    let paddleBox = paddle.boundingBox();

    // Check if the ball and paddle overlap vertically and horizontally
    let collisionOccurred =
      ballBox.left < paddleBox.right &&
      ballBox.right > paddleBox.left &&
      ballBox.top < paddleBox.bottom &&
      ballBox.bottom > paddleBox.top;

    if (collisionOccurred) {
      let distanceFromTop = ballBox.top - paddleBox.top;
      let distanceFromBottom = paddleBox.bottom - ballBox.bottom;
      this.adjustAngle(distanceFromTop, distanceFromBottom);
      this.xSpeed = xSpeedAfterBounce;
    }
  }

  checkWallCollision(width, height, scores) {
    let ballBox = this.boundingBox();

    // Hit Left Wall
    if (ballBox.left < 0) {
      scores.rightScore++;
      this.init();
    }

    // Hit Right Wall
    if (ballBox.right > width) {
      scores.leftScore++;
      this.init();
    }

    // Hit top or bottom walls
    if (ballBox.top < 0 || ballBox.bottom > height) {
      this.ySpeed = -this.ySpeed;
    }
  }
}
