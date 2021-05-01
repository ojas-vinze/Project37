var dog,happydog,dogimg,database,foods,foodstock,foodcount,foodobj,lastfed,fedtime,milk,milkimg;
var feedb,addfoodb;
var washroom,garden,bedroom,saddog,readstate,gameState;
var currenttime;

function preload(){
  happydog=loadImage("images/dogimg2.png");
  dogimg=loadImage("images/dogimg1.png");
  milkimg=loadImage("images/milk.png");
  washroom=loadImage("images/Washroom.png");
  garden=loadImage("images/Garden.png");
  bedroom=loadImage("images/Bedroom.png");
  saddog=loadImage("images/deadDog.png");
}

function setup(){
  createCanvas(1200, 570);
  database=firebase.database();
  foodobj = new Foodc();
  foodobj.getfeedtime();
  foodobj.getfoodstock();
  
  
  dog = createSprite(600,285,30,70);
  dog.addImage(dogimg);
  dog.scale = 0.3;

  feedb = createButton('Feed the dog');
  feedb.position(1000,30);
  feedb.mousePressed(feeddog);
  

  addfoodb = createButton('Add food');
  addfoodb.position(1100,30);
  addfoodb.mousePressed(addfood);

  milk = createSprite(480,350,80,80);
  milk.addImage(milkimg);
  milk.scale=0.15;
  milk.visible=false;
}

function draw(){
  background(46,139,87);
  readstate=database.ref('gamestate');
  readstate.on("value",function(data){
    gamestate=data.val();
  })

  textSize(20);
  fill(255,255,254);
  if(lastfed>=12){
    text("Last Feed: "+ lastfed%12 + "PM",350,30);
  }else if(lastfed===0){
    text("Last Feed: 12AM",350,30);
  }else{
    text("Last Feed: " + lastfed + "AM",350,30);
  }

  currenttime=hour();
  if(currenttime===(lastfed+1)){
    update("playing");
    gameState="playing";
    foodobj.garden();
  }else if(currenttime===(lastfed+2)){
    update("sleeping");
    gameState="sleeping";
    foodobj.bedroom();
  }else if(currenttime>(lastfed+2) && currenttime<=(lastfed+4)){
    update("bathing");
    gameState="bathing";
    foodobj.washroom();
  }else{
    update("hungry");
    gameState="hungry";
    foodobj.display();
  }

  if(gameState!=="hungry"){
    feedb.hide();
    addfoodb.hide();
    dog.remove();
  }else{
    feedb.show();
    addfoodb.show();
    dog.addImage(saddog);
  }

  drawSprites();
}


function feeddog(){
  milk.visible=true;
  dog.addImage(happydog);
  // foodobj.updatefoodstock(foodobj.getfoodstock()-1);
  database.ref('/').update({
    Food:foods-1,
    Feedtime:hour()
  })
}

function addfood(){
  console.log("Hi, in here!");
  foods++;
  console.log("add "+foods);
  database.ref('/').update({
    Food:foods
  })
}

function update(state){
  database.ref('/').update({
    gamestate:state
  })
}
