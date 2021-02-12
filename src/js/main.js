;(function(){

  let mainHero = document.querySelector('#mainHero');
  let playField = document.querySelector('.js-play-field');
  
  let enemyList = {};
  let kolEnemy = 6;
  let pointsEnemy = [];

  let pointsMainHero = getRandomInt(2, 10);
  let mainHeroCoordinates = getCoordinatesPlayer(mainHero);
  let mainHeroS = {
        "id" : "mainHero",
        "points": pointsMainHero,
        "coordinates": mainHeroCoordinates,
      }       

  document.addEventListener("DOMContentLoaded", function(){
   
    mainHero.innerHTML = pointsMainHero;

    countPoints();    
    createEnemyList();    
    writePointsEnemy();
    
    mainHero.onmousedown = function(event) {

      let shiftX = event.clientX - mainHero.getBoundingClientRect().left; //коорд курсора в герое
      let shiftY = event.clientY - mainHero.getBoundingClientRect().top;  //коорд курсора в герое

      document.body.append(mainHero);

      function moveAt(pageX, pageY) {
        mainHero.style.left = pageX - shiftX + 'px';
        mainHero.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      mainHero.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        locationMainHero();
        if (isEmpty(enemyList)) {
          document.querySelector('.victory').classList.add('victory--show');
          document.querySelector('.game-over').classList.add('game-over--show');
        }
        mainHero.onmouseup = null;
      };
    };

    // Disabling Drag'n'Drop Browser
    mainHero.ondragstart = function() {
      return false;
    };
  });

  // ------ Functions ------

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  //Get random X coordinates of the browser window
  function getXPositionOfEnemy() {
    let maxWidth = playField.getBoundingClientRect().width;
    let minWidth = maxWidth * 0.2 + 50;
    let x_position = getRandomInt(minWidth - 1, maxWidth);
    if (x_position > maxWidth - 50) {
      x_position = x_position - 50;
    }
    return x_position;
  }

  //Get random Y coordinates of the browser window
  function getYPositionOfEnemy() {
    let maxHeight = playField.getBoundingClientRect().height;

    let y_position = getRandomInt(0, maxHeight);

    if (y_position > maxHeight - 50) {
      y_position = y_position - 50;
    } 
    return y_position;
  }

  // Create an enemy
  function createEnemy(n) {
    let blockEnemy = document.createElement('div');

    blockEnemy.classList.add('hero');
    blockEnemy.classList.add('hero--enemy');
    blockEnemy.classList.add('js-enemy-' + n);
    blockEnemy.style.left = getXPositionOfEnemy() + 'px';
    blockEnemy.style.top = getYPositionOfEnemy() + 'px';
    playField.append(blockEnemy);
    return blockEnemy;
  }

  // Count points for enemy
  function countPoints() {
    let sum = 0;

    pointsEnemy[0] = getRandomInt(1, pointsMainHero);
    for (let i = 1; i <= kolEnemy - 1; i++) {
      sum = sum + pointsEnemy[i - 1];
      pointsEnemy[i] = getRandomInt(pointsEnemy[i - 1] + 1, pointsMainHero + sum);
    }
  }        

  //Write down points  
  function writePointsEnemy() {
    for (let i = 1; i <= kolEnemy; i++) {           
      document.querySelector('.' + enemyList[i]["class"]).innerHTML = enemyList[i]["points"];
    }
  }

  // Create a list of enemies
  function createEnemyList() {
    for (let i = 1; i <= kolEnemy; i++) {
    enemyList[i] = { "class" : "js-enemy-" + i,
                "points" : pointsEnemy[i - 1],
                "coordinates" : getCoordinatesPlayer(createEnemy(i)),
              };
    }
  };  

  // Get coordinates of the player
  function getCoordinatesPlayer (el) {
    let coordinates = {
      "xL" : el.getBoundingClientRect().left,
      "xR" : el.getBoundingClientRect().right,
      "yT" : el.getBoundingClientRect().top,
      "yB": el.getBoundingClientRect().bottom,
    };
    return coordinates;
  }

  // Determining the location of the mainHero
  function locationMainHero() {
    mainHeroCoordinates = getCoordinatesPlayer(mainHero);
    
    for (let key in enemyList) {
      let enemyCoord = enemyList[key]["coordinates"];
      let enemy = enemyList[key];
      
      if ((mainHeroCoordinates["xL"] <= enemyCoord["xR"]) &&
       (mainHeroCoordinates["xR"] >= enemyCoord["xL"]) &&
       (mainHeroCoordinates["yT"] <= enemyCoord["yB"]) &&
       (mainHeroCoordinates["yB"] >= enemyCoord["yT"])) {
        battle(enemy);
        delete(enemyList[key]);
        return;
      } 
    }
  }

  // Battle
  function battle(elem) {
    
    if (mainHeroS["points"] > elem["points"]) {
      mainHeroS["points"] = mainHeroS["points"] + elem["points"];
      document.getElementById(mainHeroS["id"]).innerHTML = mainHeroS["points"];

      mainHero.style.left = elem["coordinates"]["xL"] +'px';
      mainHero.style.top = elem["coordinates"]["yT"] + 'px';

      document.querySelector('.' + elem["class"]).hidden = true;
    } else {
      elem["points"] = elem["points"] + mainHeroS["points"];
      document.getElementById(mainHeroS["id"]).hidden = true;
      document.querySelector('.game-over').classList.add('game-over--show');
    }
  }

  // Get coordinates of the player
  function getCoordinatesPlayer (el) {
    let coordinates = {
      "xL" : el.getBoundingClientRect().left,
      "xR" : el.getBoundingClientRect().right,
      "yT" : el.getBoundingClientRect().top,
      "yB": el.getBoundingClientRect().bottom,
    };
    return coordinates;
  }

  // Test for emptiness
  function isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }  
})();  