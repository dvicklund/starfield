var starColors = ['#FF2000', '#FFD700', '#800000', '#00FFFF', '#FFFFE0', '#FF8C00'];
var colorCount = starColors.length;

function Star(x, y, size, velocity, color) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.velocity = velocity;
  this.color = color;
}

function Starfield() {
  this.fps = 30;
  this.canvas = null;
  this.width = 0;
  this.height = 0;
  this.minVelocity = 15;
  this.maxVelocity = 100;
  this.maxStarSize = 3;
  this.starCount = 300;
  this.stars = [];
  this.intervalId = 0;
  this.dragging = false;
  this.dragStart = null;
  this.mousePos = null;
}

Starfield.prototype.init = function(div) {
  var self = this;

  this.containerDiv = div;
  self.width = window.innerWidth;
  self.height = window.innerHeight;

  window.addEventListener('resize', function resize(event) {
    self.width = window.innerWidth;
    self.height = window.innerHeight;
    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.draw();
  })

  var canvas = document.createElement('canvas');
  div.appendChild(canvas)
  this.canvas = canvas
  this.canvas.width = this.width
  this.canvas.height = this.height

  function move(e) {
    if(e.touches) {
      e.preventDefault()
      e.x = e.touches[0].pageX;
      e.y = e.touches[0].pageY;
    }
    self.mousePos = e
  }

  window.addEventListener('mousedown', function(e) {
    self.dragging = true
    self.dragStart = e
    window.addEventListener('mousemove', move)
  })

  window.addEventListener('mouseup', function(e) {
    self.dragging = false
    self.dropStars()
    // self.dragStart = null
    // self.mousePos = null
    window.removeEventListener('mousemove', move)
  })

  window.addEventListener('touchstart', function(e) {
    e.preventDefault()
    self.dragging = true
    self.dragStart = e
    self.dragStart.x = e.touches[0].pageX;
    self.dragStart.y = e.touches[0].pageY;
    window.addEventListener('touchmove', move)
  })

  window.addEventListener('touchend', function(e) {
    e.preventDefault()
    self.dragging = false
    self.dropStars()
    // self.dragStart = null
    // self.mousePos = null
    window.removeEventListener('touchmove', move)
  })
}

Starfield.prototype.start = function() {
  var stars = [];

  for(var star = 0; star < this.starCount; star++) {
    stars[star] = new Star(Math.random() * this.width,
                           Math.random() * this.height,
                           Math.random() * this.maxStarSize + 1,
                           (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity,
                           starColors[Math.floor(Math.random() * colorCount)])
  }

  this.stars = stars;

  var self = this;
  this.intervalId = setInterval(function() {
    self.updateHorizontal()
    self.draw()
  }, 1000 / this.fps)
}

Starfield.prototype.update = function() {
  var dt = 1/this.fps;
  for(var i = 0; i < this.stars.length; i++) {
    var star = this.stars[i]
    star.y += dt * star.velocity
    if(star.y > this.height + star.size) {
      this.stars[i] = new Star(Math.random() * this.width,
                               -star.size,
                               Math.random() * this.maxStarSize + 1,
                               (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity,
                               starColors[Math.floor(Math.random() * colorCount)])
    }
  }
}

Starfield.prototype.updateHorizontal = function() {
  var dt = 1/this.fps;
  for(var i = 0; i < this.stars.length; i++) {
    var star = this.stars[i]
    star.x += dt * star.velocity
    if(star.x > this.width + star.size) {
      this.stars[i] = new Star(-star.size,
                              Math.random() * this.height,
                              Math.random() * this.maxStarSize + 1,
                              (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity,
                              starColors[Math.floor(Math.random() * colorCount)])
    }
  }
}

Starfield.prototype.draw = function() {
  var ctx = this.canvas.getContext('2d')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, this.width, this.height)

  for(var i = 0; i < this.stars.length; i++) {
    var star = this.stars[i]
    ctx.fillStyle = star.color
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI)
    ctx.fill()
  }

  if(this.dragging && this.mousePos) {
    ctx.strokeStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(
      ((this.mousePos.x + this.dragStart.x)/2),
      ((this.mousePos.y + this.dragStart.y)/2),
      Math.max(Math.abs(this.mousePos.x - this.dragStart.x)/2, Math.abs(this.mousePos.y - this.dragStart.y)/2),
      0, 2*Math.PI)
    ctx.stroke()
  }
}

Starfield.prototype.dropStars = function() {
  if(this.mousePos) {
    var circle = {
      xCenter: (this.mousePos.x + this.dragStart.x) / 2,
      yCenter: (this.mousePos.y + this.dragStart.y) / 2,
      radius: Math.max(Math.abs(this.mousePos.x - this.dragStart.x)/2, Math.abs(this.mousePos.y - this.dragStart.y)/2)
    }

    for(var i = 0; i < this.stars.length; i++) {
      if(Math.pow(this.stars[i].x - circle.xCenter, 2) + Math.pow(this.stars[i].y - circle.yCenter, 2) < Math.pow(circle.radius, 2)) {
        this.stars[i] = new Star(Math.random() * this.width,
                                 0,
                                 Math.random() * this.maxStarSize + 1,
                                 (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity,
                                 starColors[Math.floor(Math.random() * colorCount)])

      }
    }
  }


  this.mousePos = null;
  this.dragStart = null;
}
