;(function(){

  let mainHero = document.querySelector('.js-mainHero');
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
      console.log(key);

      if ((mainHeroCoordinates["xL"] <= enemyCoord["xR"]) &&
       (mainHeroCoordinates["xR"] >= enemyCoord["xL"]) &&
       (mainHeroCoordinates["yT"] <= enemyCoord["yB"]) &&
       (mainHeroCoordinates["yB"] >= enemyCoord["yT"])) {
        battle(enemy);
        return;
      } 
    }
  }

  function battle(elem) {
    console.log(elem);

    if (mainHeroS["points"] > elem["points"]) {
      mainHeroS["points"] = mainHeroS["points"] + elem["points"];
      document.getElementById(mainHeroS["id"]).innerHTML = mainHeroS["points"];
      mainHeroS["coordinates"] = elem["coordinates"];
      document.getElementById(elem["id"]).hidden = true; //нужно удалять элемент!!
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

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
})();

  