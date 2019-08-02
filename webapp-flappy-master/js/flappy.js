// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var width = 790;
var height = 400;
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var pipes = [];
var gapStart = game.rnd.integerInRange(1, 5);
var balloons = [];
var weights = [];
var gameGravity = 130;
var gapSize = 152;//这个空隙有多大
var gapMargin = 50;
var blockHeight = 50;
var pipeEndHeight = 25;
var pipeEndExtraWidth = 10;
var gameSpeed = 220;
var jumpPower = 92;


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("playerImg","../assets/jamesBond.gif");
  game.load.image("bg","../assets/8.jpg");
  game.load.image("playerImg2","../assets/2a.png");
  game.load.image("playerImg3","../assets/18.png");
  game.load.image("playerImg4","../assets/4.png");
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock","../assets/pipe.png");
  game.load.image("balloons","../assets/balloons.png");
  game.load.image("weight","../assets/weight.png")
  game.load.image("pipeEndHeight","../assets/pipe-end.png")


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
  //game.stage.setBackgroundColor("#a8f7c2");
  game.add.tileSprite(0,0,790,400,'bg')
  game.add.text(338,175,"比个心💗",{font:"25px Arial", fill:"red"});
  // game.add.sprite(20,20,"playerImg");
  // game.add.sprite(20,360,"playerImg");
  // game.add.sprite(740,360,"playerImg");
  // game.add.sprite(740,20,"playerImg");
  //game.add.sprite(500,200,"playerImg2");
  game.add.sprite(230,160,"playerImg4");
  game.input.onDown.add(clickHandler);
  game.input
      .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(spaceHandler,playerJump);
  labelScore = game.add.text(60,60,"0")
  player = game.add.sprite(40,100,"playerImg3");
  game.input
      .keyboard.addKey(Phaser.Keyboard.RIGHT)
      .onDown.add(moveRight);
  //game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
  //game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
  //game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
  //game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);
  var pipeInterval = 1.35 * Phaser.Timer.SECOND;
  game.time.events.loop(pipeInterval, generate);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player);
  player.body.velocity.y = -110;
  player.body.gravity.y = gameGravity;
  player.anchor.setTo(0.5, 0.5);
  game.input.onDown.add(playerJump);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(
    player,
      pipes,
      gameOver);

  if (player.y < 0 || player.y>400) {
     gameOver();
   }
   //player.rotation += 0.03;
   player.rotation = Math.atan(player.body.velocity.y / 200);
   checkBonus(balloons, -0.10);
   checkBonus(weights, 0.25);
}
// function checkBonus(bonusArray, bonusEffect) {
//   bonusEffect *= (rnd.integerInRange(10, 50));
//  // Step backwards in the array to avoid index errors from splice
//  for(var i=0; i<bonusArray.length; i--){
//    game.physics.arcade.overlap(player, bonusArray[i], function(){
//      // destroy sprite
//      bonusArray[i].destroy();
//      // remove element from array
//      bonusArray.splice(i, 1);
//      // apply the bonus effect
//      changeGravity(bonusEffect);
//    });
//   }
// }

function gameOver(){
  score = 0;
  game.state.restart();
  player.body.gravity.y = gameGravity;
}

function clickHandler(event){
  //game.add.sprite(event.x,event.y,"playerImg3");
  game.sound.play("score");
  playerJump();
}

function spaceHandler() {
  game.sound.play("score");
  playerJump();
}

function changeScore(){
  score = score + 1; //score++ or score +=
  labelScore.setText(score.toString());

}
function moveRight(){
  player.x = player.x + 10;
}
function moveLeft() {
  player.x = player.x - 10;
}
function moveUp() {
  player.y = player.y - 10;
}
function moveDown() {
  player.y = player.y + 10;
}
function addPipeBlock(x, y) {
  var pipeBlock = game.add.sprite(x,y,"pipeBlock");
  pipes.push(pipeBlock);
  game.physics.arcade.enable(pipeBlock);
  pipeBlock.body.velocity.x = -gameSpeed;
}
// function generatePipe() {
//   var gap = game.rnd.integerInRange(1 ,5);
//   for (var count = 0; count < 8; count++) {
//     if (count != gap && count != gap+1) {
//       addPipeBlock(750, count * 50);        }    }
//       changeScore();
//     }

function generatePipe() {
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart);
  for(var y = gapStart; y > 0; y -= blockHeight) {
    addPipeBlock(width, y - blockHeight);
  }
  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize);
  for(var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
    addPipeBlock(width, y);
  }
  changeScore();
}

function addPipeEnd(x, y) {
  var block = game.add.sprite(x, y, "pipeEndHeight");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -gameSpeed;
}

function playerJump() {
  player.body.velocity.y  = -jumpPower
}
function changeGravity(g) {
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}

function generateBalloons(){
  var bonus = game.add.sprite(width, height, "balloons");
  balloons.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = - 200;
  bonus.body.velocity.y = - game.rnd.integerInRange(60, 100);
}
function generateWeight(){
  var bonus = game.add.sprite(width, height, "weight");
  weights.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = - 200;
  bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
 }

function checkBonus(bonusArray, bonusEffect) {
  for(var i=bonusArray.length - 1; i>=0; i--){
    game.physics.arcade.overlap(player,bonusArray[i], function(){
      bonusArray[i].destroy();
      bonusArray.splice(i,1);
      changeGravity(bonusEffect * game.rnd.integerInRange(5,30));
    });
  }
}
function generate(){
  var x = game.rnd.integerInRange(1,25);
  if (x === 1){
    generateBalloons();
  }
  else if (x === 2){
    generateWeight();
  }
  else {
    generatePipe();
  }
}
