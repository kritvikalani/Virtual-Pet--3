//Create variables here
var dog, happyDog;
var database;
var foodS;
var foodStock;
//var milk;
var feedDog;
var addFoods;
var fedTime, lastFed;
var foodObj;
var changeState, readState;
var bedroom, garden, washroom;

function preload()
{ 
  dog1= loadImage("images/Dog.png")
  dogHappy= loadImage("images/happydog.png")
  bedroom= loadImage("images/Bed Room.png")
  garden= loadImage("images/Garden.png");
  washroom= loadImage("images/Wash Room.png")
  sadDog= loadImage("images/Lazy.png")
  //milk= loadImage("images/Milk.png")
  //load images here
  
}

function setup() {
  database= firebase.database();
	createCanvas(1000, 500);
  dog= createSprite(800,250,5,5)
  dog.scale= 0.2
  dog.addImage(dog1)

  foodStock= database.ref('Food');
  foodStock.on("value", readStock);

  foodObj= new food();

  feed= createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87)

  //foodObj.display();
  /*if (keyWentDown(UP_ARROW)) {
    writeStock(foodS);
    dog.addImage("happydog",dogHappy);
    console.log("happydog")
    //foodS= foodS - 1
  }*/
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed= data.val();
  })

  if (gameState!="Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currenttime=hour();
  if(currenttime==(lastFed+1)) {
    update("Playing")
    foodObj.garden();
  } else if(currenttime==(lastFed+2)) {
    update("Sleeping")
    foodObj.bedroom();
  } else if(currenttime>(lastFed+2) && currenttime<=(lastFed+4)) {
    update("Bathing")
    foodObj.washroom();
  } else{
    update("Hungry")
    foodObj.display();
  }

  fill(255,255,254);
textSize(15);
if (lastFed>=12) {
  text("Last Feed : " + lastFed%12  + "PM", 350,30)
} else if(lastFed==0) {
  text("Last Feed : 12 AM", 350, 30);
} else{
  text("Last Feed : " + lastFed + "AM", 350, 30)
}

  drawSprites();

  //add styles here
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x) {
  if (x<=0) {
    x = 0;
  }
  else {
    x= x-1
  }

database.ref('/').update({
  Food:x
})*/

function addFoods() {
foodS++
database.ref('/').update({
  Food:foodS
})
}

function gameState() {
  readState= database.ref("gameState");
  readState.on("value", function(data) {
  gameState= data.val();
  })
}

function feedDog() {
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state) {
  database.ref('/').update({
    gameState:state
  })
}




