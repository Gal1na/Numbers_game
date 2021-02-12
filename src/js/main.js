;(function(){

  let mainHero = document.querySelector('.js-mainHero');
  let kolEnemy = 3;
  let playField = document.querySelector('.js-play-field');

  let enemy1 = document.querySelector('.js-hero-enemy-1');
  let enemy2 = document.querySelector('.js-hero-enemy-2');
  let enemy3 = document.querySelector('.js-hero-enemy-3');
  let pointsMainHero;
  let pointsEnemy1;
  let pointsEnemy2;
  let pointsEnemy3;

    pointsMainHero = getRndInteger(2, 10);
    pointsEnemy1 = getRndInteger(1, pointsMainHero);
    pointsEnemy2 = getRndInteger(pointsEnemy1 + 1, pointsMainHero + pointsEnemy1);
    pointsEnemy3 = getRndInteger(pointsEnemy2 + 1, pointsMainHero + pointsEnemy1 + pointsEnemy2);

    let pointsEnemy = [];
    let sum = 0;
    pointsEnemy[0] = getRndInteger(1, pointsMainHero);
    
    for (let i = 1; i <= kolEnemy - 1; i++) {
      sum = sum + pointsEnemy[i - 1];
      pointsEnemy[i] = getRndInteger(pointsEnemy[i - 1] + 1, pointsMainHero + sum);
    }

    //console.log (pointsEnemy);

    let test = {};

    for (let i = 1; i <= kolEnemy; i++) {
      test[i] = { "class" : "js-enemy-" + i,
                  "points" : pointsEnemy[i - 1],
                  "coordinates" : playerCoordinates(createEnemy(i)),
                };
    }
    
    writeDownPoints();    

    mainHero.innerHTML = pointsMainHero;
    enemy1.innerHTML = pointsEnemy1;
    enemy2.innerHTML = pointsEnemy2;
    enemy3.innerHTML = pointsEnemy3;

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentEnemy = null;

    let mainHeroCoordinates = playerCoordinates(mainHero);
    let enemy1Coordinates = playerCoordinates(enemy1);
    let enemy2Coordinates = playerCoordinates(enemy2);
    let enemy3Coordinates = playerCoordinates(enemy3);

    let mainHeroS = {
      "id" : "mainHero",
      "points": pointsMainHero,
      "coordinates": mainHeroCoordinates,
    }    

    let enemyList = {
      1: {
        "id" : "enemy1",
        "points": pointsEnemy1,
        "coordinates": enemy1Coordinates,
      },  
      2: {
        "id" : "enemy2",
        "points": pointsEnemy2,
        "coordinates": enemy2Coordinates,
      }, 
      3: {
        "id" : "enemy3",
        "points": pointsEnemy3,
        "coordinates": enemy3Coordinates,
      },  
    }

  $(document).ready(function() {    
    
    mainHero.onmousedown = function(event) {

      let shiftX = event.clientX - mainHero.getBoundingClientRect().left; //коорд курсора в герое
      let shiftY = event.clientY - mainHero.getBoundingClientRect().top;  //коорд курсора в герое

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

  // Determining the location of the mainHero
  function locationMainHero() {
    mainHeroCoordinates = playerCoordinates(mainHero);
    
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

  function battle(elem) {
    console.log(elem);

    if (mainHeroS["points"] > elem["points"]) {
      mainHeroS["points"] = mainHeroS["points"] + elem["points"];
      document.getElementById(mainHeroS["id"]).innerHTML = mainHeroS["points"];

      mainHero.style.left = elem["coordinates"]["xL"] +'px';
      mainHero.style.top = elem["coordinates"]["yT"] + 'px';

      document.getElementById(elem["id"]).hidden = true;
    } else {
      elem["points"] = elem["points"] + mainHeroS["points"];
      document.getElementById(mainHeroS["id"]).hidden = true;
      document.querySelector('.game-over').classList.add('game-over--show');
    }
  }

  function playerCoordinates (el) {
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

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  //Get random X coordinates of the browser window
  function getXPositionOfEnemy() {
    let maxWidth = playField.getBoundingClientRect().width;
    let minWidth = maxWidth * 0.2 + 50;
    let x_position = getRndInteger(minWidth - 1, maxWidth);
    //let x_position = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    if (x_position > maxWidth - 50) {
      x_position = x_position - 50;
    }
    return x_position;
  }

  //Get random Y coordinates of the browser window
  function getYPositionOfEnemy() {
    let maxHeight = playField.getBoundingClientRect().height;

    let y_position = getRndInteger(0, maxHeight);

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
      //blockEnemy.id = id;
      blockEnemy.style.left = getXPositionOfEnemy() + 'px';
      blockEnemy.style.top = getYPositionOfEnemy() + 'px';
      playField.append(blockEnemy);
      return blockEnemy;
    }

  //Write down points  
  function writeDownPoints() {
    for (let i = 1; i <= kolEnemy; i++) {           
      document.querySelector('.' + test[i]["class"]).innerHTML = test[i]["points"];
    }
  }


})();

  