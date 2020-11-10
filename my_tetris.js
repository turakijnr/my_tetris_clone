"use strict";

var Tetris = {
  config: {
    pitchID: "tetris",
    brick: "<b></b>",
    freeBrick: {
      background: "#000",
      border: "1px solid #333"
    },
    filledBrick: {
      background: "#fff",
      border: "1px solid #999"
    },
    speed: 1000,
    figureTypes: {
      I: function() {
        return [
          [[-3,5]],
          [[-2,5]],
          [[-1,5]],
          [[ 0,5]]
      	];
      },
      J: function() {
        return [
               [[-2,6]],
               [[-1,6]],
          [[0,5],[0,6]]
      ];
      },
      L: function() {
        return [
          [[-2,5]],
          [[-1,5]],
          [[0,5],[0,6]]
      ];
      },
      O: function() {
        return [
        [[-1,5],[-1,6]],
        [[ 0,5], [0,6]]
      ];
      },
      S: function() {
        return [
              [[-1,6],[-1,7]],
        [[0,5], [0,6]]
      ];
      },
      T: function() {
        return [
        [[-1,5],[-1,6],[-1,7]],
               [[0,6]]
      ];
      },
      Z: function() {
        return [
            [[-1,4],[-1,5]],
                    [[0,5], [0,6]]
          ];
      }
    }
  },
  startBtn: document.getElementById('start-btn'),
  pitch: {
    width: 12,
    height: 20,
    bricks: [],
    getDom: function() {
      return document.getElementById(Tetris.config.pitchID);
    }
  },
  figure: {
		coords: [],
    go: function() {
      if (this.coords.length == 0) {
        this.create();
      } else {
        this.process();
      }
    },
    create: function() {
      this.getRandomFigure();
    },
    rotatePosition: 0,
    rotate: function() {
      if (this.coords.length == 0) {
        return false;
      }
      this.setRotatedCoords();
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureCol < 0) {
          Tetris.figure.needStepSide = 'right';
        }
        if (figureCol >= Tetris.pitch.width) {
          Tetris.figure.needStepSide = 'left';
        }
      });
      if (this.needStepSide) {
        this.sideStep(this.needStepSide);
        this.needStepSide = false;
      }
      if (this.touched()) {
        this.rotateRollback();
        return false;
      }
      Tetris.draw();
    },
    needStepSide: false,
    rotateRollback: function() {
      	this.setRotatedCoords();
        this.setRotatedCoords();
        this.setRotatedCoords();
    },
    setRotatedCoords: function() {
      var newCoords = [];
      switch(this.type) {
        case 'I':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[2][0][0], this.coords[2][0][1]-1],
                  [this.coords[2][0][0], this.coords[2][0][1]],
                  [this.coords[2][0][0], this.coords[2][0][1]+1],
                  [this.coords[2][0][0], this.coords[2][0][1]+2]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][1][0]-2, this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0]-1, this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0],   this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0]+1, this.coords[0][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'S':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[1][1][0]+1, this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]+1],
                	[this.coords[0][0][0], this.coords[0][0][1]+2]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'Z':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][1][0], this.coords[0][1][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-2],
                	[this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'T':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]]
                ],[
                  [this.coords[0][0][0], this.coords[0][0][1]],
                  [this.coords[0][1][0], this.coords[0][1][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][1][0], this.coords[1][1][1]],
                  [this.coords[1][2][0], this.coords[1][2][1]]
                ],[
                  [this.coords[1][1][0]+1, this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[0][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[2][0][0], this.coords[2][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'J':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]],
                  [this.coords[0][0][0], this.coords[0][0][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]+1]
                ],[
                  [this.coords[0][1][0], this.coords[0][1][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'L':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1],
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]+2]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]+2]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[1][0][1]+1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]-1]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]-1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]-1]
                ],[
                  [this.coords[0][1][0], this.coords[0][1][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
      }
    },
    getRandomFigure: function() {
      var keys = Object.keys(Tetris.config.figureTypes);
      var randKey = Math.floor(Math.random() * keys.length);
      Tetris.figure.type = keys[randKey];
      this.coords = Tetris.config.figureTypes[keys[randKey]]();
      var rotatePosition = Math.floor(Math.random() * 4);
      if (rotatePosition) {
        for (var i = 0; i < rotatePosition; i++) {
          this.setRotatedCoords();
        }
      }
      console.log(rotatePosition);
    },
    process: function() {
      if (this.touched()) {
        this.joinToBricks();
        if (!Tetris.checkGameOver()) {
        	this.destroy();
          this.create();
        }
      } else {
        this.makeStep();
      }
    },
    touched: function() {
      var contact = false;
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        if (figureRow >= 0 && Tetris.pitch.bricks[figureRow + 1]  == undefined) {
          contact = true;
        }
      });
      if (contact) {
        return contact;
      }
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow >= 0 && Tetris.pitch.bricks[figureRow + 1][figureCol]) {
          contact = true;
        }
      });
      if (contact) {
        return contact;
      }
      return false;
    },
    joinToBricks: function() {
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow >= 0) {
          Tetris.pitch.bricks[figureRow][figureCol] = 1;
        }
      });
      Tetris.checkLines();
    },
    destroy: function() {
      this.coords = [];
      this.rotatePosition = 0;
    },
    makeStep: function() {
      Tetris.each(this.coords, function(i,j){
        Tetris.figure.coords[i][j][0]++;
      });
    },
    rollback: false,
    sideStepSpeed: 0,
    sideStepStart: function(direction) {
      if (!this.sideStepSpeed) {
        this.sideStepSpeed = 50;
        this.sideStepHandler = setInterval(function(){
          Tetris.figure.sideStep(direction);
        }, this.sideStepSpeed);
      }
    },
    sideStepStop: function() {
      if (this.sideStepHandler != undefined || !this.sideStepHandler) {
        this.sideStepSpeed = 0;
        clearInterval(this.sideStepHandler);
      }
    },
    sideStep: function(direction) {
      Tetris.each(this.coords, function(i,j){
        if (direction == 'right') {
        	Tetris.figure.coords[i][j][1]++;
        } else {
          Tetris.figure.coords[i][j][1]--;
        }
      });
      Tetris.each(this.coords, function(i,j){
        var coord = Tetris.figure.coords[i][j];
        var brick;
        if (coord[0] >= 0) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          if (brick == undefined) {
            Tetris.figure.rollback = true;
          }
        }
        if (Tetris.pitch.bricks[coord[0]] != undefined) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          if (brick == 1) {
            Tetris.figure.rollback = true;
          }
        }
      });
      if (this.rollback) {
        Tetris.each(this.coords, function(i,j){
          if (direction == 'right') {
            Tetris.figure.coords[i][j][1]--;
          } else {
            Tetris.figure.coords[i][j][1]++;
          }
        });
        this.rollback = false;
      } else {
        Tetris.draw();
      }
    },
    checkCoords: function(row, col) {
      var checked = false;
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow == row) {
          if (figureCol == col) {
            checked = true;
          }
        }
      });
      return checked;
    }
  },
  init: function() {
    for (var i = 0; i < Tetris.pitch.height; i++) {
      Tetris.pitch.bricks[i] = [];
      for (var j = 0; j < Tetris.pitch.width; j++) {
        Tetris.pitch.bricks[i][j] = 0;
      }
    }
    Tetris.startBtn.onclick = function () {
      Tetris.clearPitch();
			Tetris.tick();
    }
    window.onkeydown = function (event) {
      var direction = '';
      if (event.keyCode == 39) {
        direction = 'right';
      } else if(event.keyCode == 37) {
        direction = 'left';
      }
      if (direction) {
        Tetris.figure.sideStepStart(direction);
      } else if(event.keyCode == 40) {
        Tetris.setSpeed(30);
      }
      if (event.keyCode == 38) {
        Tetris.figure.rotate();
      }
      if (event.keyCode == 27 || event.keyCode == 32) {
        pause();
      }
    }
    function pause(){
      alert('Game paused, Click OK to continue');
    }
    window.onkeyup = function (event) {
      var direction = '';
      if (event.keyCode == 39) {
        direction = 'right';
      } else if(event.keyCode == 37) {
        direction = 'left';
      }
      if (direction) {
        Tetris.figure.sideStepStop();
      } else if(event.keyCode == 40) {
        Tetris.setSpeed();
      }
    }
  },
  tick: function() {
    console.log('tick');
    Tetris.figure.go();
    Tetris.draw();
    if (Tetris.tickHandler === undefined) {
      Tetris.setSpeed();
    }
  },
  currentSpeed: 0,
  setSpeed: function(speed) {
    if (!speed) var speed = Tetris.config.speed;
    if (speed != this.currentSpeed) {
      if (Tetris.tickHandler !== undefined) {
        clearInterval(Tetris.tickHandler);
      }
      Tetris.tickHandler = setInterval(function(){
        Tetris.tick();
      }, speed);
      this.currentSpeed = speed;
    }
  },
  clearPitch: function() {
    var tetrisDom = Tetris.pitch.getDom();
    tetrisDom.innerHTML = '';
    Tetris.each(Tetris.pitch.bricks, function(i,j){
      tetrisDom.innerHTML += Tetris.config.brick;
    });
  },
  draw: function() {
    var tetrisDom = Tetris.pitch.getDom();
    Tetris.each(Tetris.pitch.bricks, function(i,j){
      var fillBG = Tetris.config.filledBrick.background;
      var freeBG = Tetris.config.freeBrick.background;
      var fillBorder = Tetris.config.filledBrick.border;
      var freeBorder = Tetris.config.freeBrick.border;
      var brickIndex = i * Tetris.pitch.width + j;
      if (Tetris.pitch.bricks[i][j] || Tetris.figure.checkCoords(i,j)) {
        tetrisDom.getElementsByTagName('b')[brickIndex].style.background = fillBG;
        tetrisDom.getElementsByTagName('b')[brickIndex].style.border = fillBorder;
      } else {
        tetrisDom.getElementsByTagName('b')[brickIndex].style.background = freeBG;
        tetrisDom.getElementsByTagName('b')[brickIndex].style.border = freeBorder;
      }
    });
  },
  checkGameOver: function() {
    var gameover = false;
    Tetris.each(Tetris.figure.coords, function(i,j){
      var figureRow = Tetris.figure.coords[i][j][0];
      if (figureRow == 0 && !gameover) {
        alert('Game Over');
        clearInterval(Tetris.tickHandler);
        gameover = true;
      }
    });
    return gameover;
  },
  checkLines: function() {
    var emptyLine = [];
    for (var i = 0; i < this.pitch.width; i++) {
    	emptyLine.push(0);
    }
    for (var i = 0; i < this.pitch.bricks.length; i++) {
      var countFilled = 0;
      for (var j = 0; j < this.pitch.bricks[i].length; j++) {
        if (this.pitch.bricks[i][j]) {
          countFilled++;
        }
      }
      if (countFilled == this.pitch.width) {
        this.pitch.bricks.splice(i, 1);
        this.pitch.bricks.unshift(emptyLine);
      }
    }
  },
  each: function(coords, callback) {
    for (var i = 0; i < coords.length; i++) {
      for (var j = 0; j < coords[i].length; j++) {
        callback(i,j);
      }
    }
  }
};
Tetris.init();

// https://github.com/ghosh/uiGradients/blob/master/gradients.json
var gradients = [["Sea Blue", ["#2b5876", "#4e4376"]], ["Nimvelo", ["#314755", "#26a0da"]], ["Noon to Dusk", ["#ff6e7f", "#bfe9ff"]], ["YouTube", ["#e52d27", "#b31217"]], ["Cool Brown", ["#603813", "#b29f94"]], ["Harmonic Energy", ["#16A085", "#F4D03F"]], ["Playing with Reds", ["#D31027", "#EA384D"]], ["Sunny Days", ["#EDE574", "#E1F5C4"]], ["Green Beach", ["#02AAB0", "#00CDAC"]], ["Intuitive Purple", ["#DA22FF", "#9733EE"]], ["Emerald Water", ["#348F50", "#56B4D3"]], ["Lemon Twist", ["#3CA55C", "#B5AC49"]], ["Horizon", ["#003973", "#E5E5BE"]], ["Rose Water", ["#E55D87", "#5FC3E4"]], ["Frozen", ["#403B4A", "#E7E9BB"]], ["Mango Pulp", ["#F09819", "#EDDE5D"]], ["Bloody Mary", ["#FF512F", "#DD2476"]], ["Aubergine", ["#AA076B", "#61045F"]], ["Aqua Marine", ["#1A2980", "#26D0CE"]], ["Sunrise", ["#FF512F", "#F09819"]], ["Purple Paradise", ["#1D2B64", "#F8CDDA"]], ["Sea Weed", ["#4CB8C4", "#3CD3AD"]], ["Pinky", ["#DD5E89", "#F7BB97"]], ["Cherry", ["#EB3349", "#F45C43"]], ["Mojito", ["#1D976C", "#93F9B9"]], ["Juicy Orange", ["#FF8008", "#FFC837"]], ["Mirage", ["#16222A", "#3A6073"]], ["Steel Gray", ["#1F1C2C", "#928DAB"]], ["Kashmir", ["#614385", "#516395"]], ["Electric Violet", ["#4776E6", "#8E54E9"]], ["Venice Blue", ["#085078", "#85D8CE"]], ["Bora Bora", ["#2BC0E4", "#EAECC6"]], ["Moss", ["#134E5E", "#71B280"]], ["Shroom Haze", ["#5C258D", "#4389A2"]], ["Mystic", ["#757F9A", "#D7DDE8"]], ["Midnight City", ["#232526", "#414345"]], ["Sea Blizz", ["#1CD8D2", "#93EDC7"]], ["Opa", ["#3D7EAA", "#FFE47A"]], ["Titanium", ["#283048", "#859398"]], ["Mantle", ["#24C6DC", "#514A9D"]], ["Dracula", ["#DC2424", "#4A569D"]], ["Peach", ["#ED4264", "#FFEDBC"]], ["Moonrise", ["#DAE2F8", "#D6A4A4"]], ["Clouds", ["#ECE9E6", "#FFFFFF"]], ["Stellar", ["#7474BF", "#348AC7"]], ["Bourbon", ["#EC6F66", "#F3A183"]], ["Calm Darya", ["#5f2c82", "#49a09d"]], ["Influenza", ["#C04848", "#480048"]], ["Shrimpy", ["#e43a15", "#e65245"]], ["Army", ["#414d0b", "#727a17"]], ["Miaka", ["#FC354C", "#0ABFBC"]], ["Pinot Noir", ["#4b6cb7", "#182848"]], ["Day Tripper", ["#f857a6", "#ff5858"]], ["Namn", ["#a73737", "#7a2828"]], ["Blurry Beach", ["#d53369", "#cbad6d"]], ["Vasily", ["#e9d362", "#333333"]], ["A Lost Memory", ["#DE6262", "#FFB88C"]], ["Petrichor", ["#666600", "#999966"]], ["Jonquil", ["#FFEEEE", "#DDEFBB"]], ["Sirius Tamed", ["#EFEFBB", "#D4D3DD"]], ["Kyoto", ["#c21500", "#ffc500"]], ["Misty Meadow", ["#215f00", "#e4e4d9"]], ["Aqualicious", ["#50C9C3", "#96DEDA"]], ["Moor", ["#616161", "#9bc5c3"]], ["Almost", ["#ddd6f3", "#faaca8"]], ["Forever Lost", ["#5D4157", "#A8CABA"]], ["Winter", ["#E6DADA", "#274046"]], ["Autumn", ["#DAD299", "#B0DAB9"]], ["Candy", ["#D3959B", "#BFE6BA"]], ["Reef", ["#00d2ff", "#3a7bd5"]], ["The Strain", ["#870000", "#190A05"]], ["Dirty Fog", ["#B993D6", "#8CA6DB"]], ["Earthly", ["#649173", "#DBD5A4"]], ["Virgin", ["#C9FFBF", "#FFAFBD"]], ["Ash", ["#606c88", "#3f4c6b"]], ["Shadow Night", ["#000000", "#53346D"]], ["Cherryblossoms", ["#FBD3E9", "#BB377D"]], ["Parklife", ["#ADD100", "#7B920A"]], ["Dance To Forget", ["#FF4E50", "#F9D423"]], ["Starfall", ["#F0C27B", "#4B1248"]], ["Red Mist", ["#000000", "#e74c3c"]], ["Teal Love", ["#AAFFA9", "#11FFBD"]], ["Neon Life", ["#B3FFAB", "#12FFF7"]], ["Man of Steel", ["#780206", "#061161"]], ["Amethyst", ["#9D50BB", "#6E48AA"]], ["Cheer Up Emo Kid", ["#556270", "#FF6B6B"]], ["Shore", ["#70e1f5", "#ffd194"]], ["Facebook Messenger", ["#00c6ff", "#0072ff"]], ["SoundCloud", ["#fe8c00", "#f83600"]], ["Behongo", ["#52c234", "#061700"]], ["ServQuick", ["#485563", "#29323c"]], ["Friday", ["#83a4d4", "#b6fbff"]], ["Martini", ["#FDFC47", "#24FE41"]], ["Metallic Toad", ["#abbaab", "#ffffff"]], ["Between The Clouds", ["#73C8A9", "#373B44"]], ["Crazy Orange I", ["#D38312", "#A83279"]], ["Hersheys", ["#1e130c", "#9a8478"]], ["Talking To Mice Elf", ["#948E99", "#2E1437"]], ["Purple Bliss", ["#360033", "#0b8793"]], ["Predawn", ["#FFA17F", "#00223E"]], ["Endless River", ["#43cea2", "#185a9d"]], ["Pastel Orange at the Sun", ["#ffb347", "#ffcc33"]], ["Twitch", ["#6441A5", "#2a0845"]], ["Instagram", ["#517fa4", "#243949"]], ["Flickr", ["#ff0084", "#33001b"]], ["Vine", ["#00bf8f", "#001510"]], ["Turquoise flow", ["#136a8a", "#267871"]], ["Portrait", ["#8e9eab", "#eef2f3"]], ["Virgin America", ["#7b4397", "#dc2430"]], ["Koko Caramel", ["#D1913C", "#FFD194"]], ["Fresh Turboscent", ["#F1F2B5", "#135058"]], ["Green to dark", ["#6A9113", "#141517"]], ["Ukraine", ["#004FF9", "#FFF94C"]], ["Curiosity blue", ["#525252", "#3d72b4"]], ["Dark Knight", ["#BA8B02", "#181818"]], ["Piglet", ["#ee9ca7", "#ffdde1"]], ["Lizard", ["#304352", "#d7d2cc"]], ["Sage Persuasion", ["#CCCCB2", "#757519"]], ["Between Night and Day", ["#2c3e50", "#3498db"]], ["Timber", ["#fc00ff", "#00dbde"]], ["Passion", ["#e53935", "#e35d5b"]], ["Clear Sky", ["#005C97", "#363795"]], ["Master Card", ["#f46b45", "#eea849"]], ["Back To Earth", ["#00C9FF", "#92FE9D"]], ["Deep Purple", ["#673AB7", "#512DA8"]], ["Little Leaf", ["#76b852", "#8DC26F"]], ["Netflix", ["#8E0E00", "#1F1C18"]], ["Light Orange", ["#FFB75E", "#ED8F03"]], ["Green and Blue", ["#c2e59c", "#64b3f4"]], ["Poncho", ["#403A3E", "#BE5869"]], ["Back to the Future", ["#C02425", "#F0CB35"]], ["Blush", ["#B24592", "#F15F79"]], ["Inbox", ["#457fca", "#5691c8"]], ["Purplin", ["#6a3093", "#a044ff"]], ["Pale Wood", ["#eacda3", "#d6ae7b"]], ["Haikus", ["#fd746c", "#ff9068"]], ["Pizelex", ["#114357", "#F29492"]], ["Joomla", ["#1e3c72", "#2a5298"]], ["Christmas", ["#2F7336", "#AA3A38"]], ["Minnesota Vikings", ["#5614B0", "#DBD65C"]], ["Miami Dolphins", ["#4DA0B0", "#D39D38"]], ["Forest", ["#5A3F37", "#2C7744"]], ["Nighthawk", ["#2980b9", "#2c3e50"]], ["Superman", ["#0099F7", "#F11712"]], ["Suzy", ["#834d9b", "#d04ed6"]], ["Dark Skies", ["#4B79A1", "#283E51"]], ["Deep Space", ["#000000", "#434343"]], ["Decent", ["#4CA1AF", "#C4E0E5"]], ["Colors Of Sky", ["#E0EAFC", "#CFDEF3"]], ["Purple White", ["#BA5370", "#F4E2D8"]], ["Ali", ["#ff4b1f", "#1fddff"]], ["Alihossein", ["#f7ff00", "#db36a4"]], ["Shahabi", ["#a80077", "#66ff00"]], ["Red Ocean", ["#1D4350", "#A43931"]], ["Tranquil", ["#EECDA3", "#EF629F"]], ["Transfile", ["#16BFFD", "#CB3066"]], ["Sylvia", ["#ff4b1f", "#ff9068"]], ["Sweet Morning", ["#FF5F6D", "#FFC371"]], ["Politics", ["#2196f3", "#f44336"]], ["Bright Vault", ["#00d2ff", "#928DAB"]], ["Solid Vault", ["#3a7bd5", "#3a6073"]], ["Sunset", ["#0B486B", "#F56217"]], ["Grapefruit Sunset", ["#e96443", "#904e95"]], ["Deep Sea Space", ["#2C3E50", "#4CA1AF"]], ["Dusk", ["#2C3E50", "#FD746C"]], ["Minimal Red", ["#F00000", "#DC281E"]], ["Royal", ["#141E30", "#243B55"]], ["Mauve", ["#42275a", "#734b6d"]], ["Frost", ["#000428", "#004e92"]], ["Lush", ["#56ab2f", "#a8e063"]], ["Firewatch", ["#cb2d3e", "#ef473a"]], ["Sherbert", ["#f79d00", "#64f38c"]], ["Blood Red", ["#f85032", "#e73827"]], ["Sun on the Horizon", ["#fceabb", "#f8b500"]], ["IIIT Delhi", ["#808080", "#3fada8"]], ["Dusk", ["#ffd89b", "#19547b"]], ["50 Shades of Grey", ["#bdc3c7", "#2c3e50"]], ["Dania", ["#BE93C5", "#7BC6CC"]], ["Limeade", ["#A1FFCE", "#FAFFD1"]], ["Disco", ["#4ECDC4", "#556270"]], ["Love Couple", ["#3a6186", "#89253e"]], ["Azure Pop", ["#ef32d9", "#89fffd"]], ["Nepal", ["#de6161", "#2657eb"]], ["Cosmic Fusion", ["#ff00cc", "#333399"]], ["Snapchat", ["#fffc00", "#ffffff"]], ["Ed's Sunset Gradient", ["#ff7e5f", "#feb47b"]], ["Brady Brady Fun Fun", ["#00c3ff", "#ffff1c"]], ["Black Rosé", ["#f4c4f3", "#fc67fa"]], ["80's Purple", ["#41295a", "#2F0743"]], ["Ibiza Sunset", ["#ee0979", "#ff6a00"]], ["Dawn", ["#F3904F", "#3B4371"]], ["Mild", ["#67B26F", "#4ca2cd"]], ["Vice City", ["#3494E6", "#EC6EAD"]], ["Cocoaa Ice", ["#c0c0aa", "#1ce"]], ["EasyMed", ["#DCE35B", "#45B649"]], ["Rose Colored Lenses", ["#E8CBC0", "#636FA4"]], ["What lies Beyond", ["#F0F2F0", "#000C40"]], ["Roseanna", ["#FFAFBD", "#ffc3a0"]], ["Honey Dew", ["#43C6AC", "#F8FFAE"]], ["Under the Lake", ["#093028", "#237A57"]], ["The Blue Lagoon", ["#43C6AC", "#191654"]], ["Can You Feel The Love Tonight", ["#4568DC", "#B06AB3"]], ["Very Blue", ["#0575E6", "#021B79"]], ["Love and Liberty", ["#200122", "#6f0000"]], ["Orca", ["#44A08D", "#093637"]], ["Venice", ["#6190E8", "#A7BFE8"]], ["Pacific Dream", ["#34e89e", "#0f3443"]], ["Learning and Leading", ["#F7971E", "#FFD200"]], ["Celestial", ["#C33764", "#1D2671"]], ["Aubergine", ["#20002c", "#cbb4d4"]], ["Sha la la", ["#D66D75", "#E29587"]], ["Mini", ["#30E8BF", "#FF8235"]], ["Maldives", ["#B2FEFA", "#0ED2F7"]], ["Cinnamint", ["#4AC29A", "#BDFFF3"]], ["Html", ["#E44D26", "#F16529"]], ["Coal", ["#EB5757", "#000000"]], ["Sunkist", ["#F2994A", "#F2C94C"]], ["Blue Skies", ["#56CCF2", "#2F80ED"]], ["Chitty Chitty Bang Bang", ["#007991", "#78ffd6"]], ["Visions of Grandeur", ["#000046", "#1CB5E0"]], ["Crystal Clear", ["#159957", "#155799"]]];

function l(color) {
  return d3.lab(color).l;
}
var g = gradients.filter(function (_ref) {
  var colors = _ref[1];

  if (l(colors[0]) > l(colors[1])) {
    colors.reverse();
  }
  return l(colors[0]) < 50 && l(colors[1]) > 60;
});
function setBackground() {
  var _g$Math$floor = g[Math.floor(Math.random() * g.length)];
  var name = _g$Math$floor[0];
  var colors = _g$Math$floor[1];

  document.body.parentElement.style.backgroundImage = "linear-gradient(" + colors[0] + ", " + colors[1] + ")";
  document.getElementById('name').textContent = name;
}

setBackground();
onclick = setBackground;

//////////////////////////////

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var L = undefined;
var m = undefined;
var n = undefined;
var banned = undefined;

var threshold = 0.15;
var Threshold = 0.015;
function init() {
  L = innerWidth < 540 ? 19 : innerWidth < 960 ? 29 : 39;
  m = Math.ceil(innerWidth / L) + 2;
  n = Math.ceil(innerHeight / L) + 2;

  canvas.width = m * L;
  canvas.height = n * L;
  canvas.style.left = innerWidth / 2 + "px";
  canvas.style.top = innerHeight / 2 + "px";

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 3;

  banned = [];
  for (var i = 0; i < m; i++) {
    banned[i] = [];
  }

  for (var i = 0; i < m; i++) {
    for (var j = 0; j < n; j++) {
      var seed = Math.random();
      if (seed < threshold) {
        if (seed < Threshold) {
          drawShape(i, j, Math.floor(seed / Threshold * shapes.length));
        } else {
          drawStar(i, j);
        }
      }
    }
  }
}
function drawStar(i, j) {
  if (banned[i][j]) return;
  banned[i][j] = true;
  ctx.fillRect(i * L, j * L, 3, 3);
}
function drawLine(i, j, size, isVertical) {
  if (size > 1) {
    for (var d = 1; d < size; d++) {
      if (isVertical) {
        banned[i][j + d] = true;
      } else {
        banned[i + d][j] = true;
      }
    }
  }
  ctx.beginPath();
  if (!isVertical) {
    ctx.moveTo(i * L + 6, j * L + 1.5);
    ctx.lineTo((i + size) * L - 3, j * L + 1.5);
  } else {
    ctx.moveTo(i * L + 1.5, j * L + 6);
    ctx.lineTo(i * L + 1.5, (j + size) * L - 3);
  }
  ctx.stroke();
}
var shapes = [[{ width: 2, height: 2 }, [0, 0], [1, 0], [2, 0], [2, 1], [0, 1], [0, 2], [2, 2], [0, 0, 1], [1, 0, 1], [0, 2, 2], [0, 0, 1, true], [0, 1, 1, true], [2, 0, 1, true], [2, 1, 1, true]], [{ width: 3, height: 2 }, [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [3, 2], [1, 0, 1], [0, 1, 1], [2, 1, 1], [0, 2, 1], [1, 2, 2], [1, 0, 1, true], [2, 0, 1, true], [0, 1, 1, true], [3, 1, 1, true]], [{ width: 3, height: 2 }, [1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [1, 0, 2], [0, 1, 1], [2, 1, 1], [0, 2, 1], [1, 2, 1], [1, 0, 1, true], [3, 0, 1, true], [0, 1, 1, true], [2, 1, 1, true]], [{ width: 3, height: 2 }, [0, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [0, 0, 2], [2, 0, 1], [1, 1, 1], [2, 1, 1], [0, 2, 1], [0, 0, 1, true], [0, 1, 1, true], [3, 0, 1, true], [1, 1, 1, true]]].map(function (shape) {
  var props = shape.shift();
  return Object.assign(shape, props);
});

function canDrawShape(i, j, id) {
  var shape = shapes[id];
  for (var _m = 0; _m <= shape.width; _m++) {
    banned[_m + i] = banned[_m + i] || [];
    if (banned[_m + i][j]) return false;
  }
  for (var _n = 0; _n <= shape.height; _n++) {
    if (banned[i][_n + j]) return false;
  }
  return true;
}
function drawShape(i, j, id) {
  if (!canDrawShape(i, j, id)) return;
  var shape = shapes[id];
  shape.forEach(function (e) {
    if (e.length === 2) drawStar(e[0] + i, e[1] + j);else drawLine(e[0] + i, e[1] + j, e[2], e[3]);
  });
  for (var _m2 = 0; _m2 <= shape.width; _m2++) {
    for (var _n2 = 0; _n2 <= shape.height; _n2++) {
      banned[_m2 + i] = banned[_m2 + i] || [];
      banned[_m2 + i][_n2 + j] = true;
    }
  }
}

init();
onmousemove = function onmousemove(e) {
  var dX = e.clientX - innerWidth / 2;
  var dY = e.clientY - innerHeight / 2;

  canvas.style.left = innerWidth / 2 - L * Math.atan(dX / innerWidth * 1.4) + "px";
  canvas.style.top = innerHeight / 2 - L * Math.atan(dY / innerHeight * 1.4) + "px";
};