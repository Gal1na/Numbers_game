;(function(){

  $(document).ready(function() {
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

    mainHero.ondragstart = function() {
      return false;
    };

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
    
    mainHero.onmousedown = function(event) {

      let shiftX = event.clientX - mainHero.getBoundingClientRect().left; //коорд курсора в герое
      let shiftY = event.clientY - mainHero.getBoundingClientRect().top;  //коорд курсора в герое

      //координаты верхнего левого угла героя (xLeft,yTop)
      function moveAt(pageX, pageY) {
        mainHero.style.left = pageX - shiftX + 'px';
        mainHero.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        mainHero.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY); // элемент, где координаты курсора на поле (не на герое)
        mainHero.hidden = false;

        if (!elemBelow) return; //если героя вынесли за пределы экрана
      }

      document.addEventListener('mousemove', onMouseMove);

     /* mainHero.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        mainHero.onmouseup = null;
      };*/
    };

/*    mainHero.onmousemove = function(event) {
      moveAt(event.pageX, event.pageY);

      mainHero.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY); // элемент, где координаты курсора на поле (не на герое)
      mainHero.hidden = false;

      if (!elemBelow) return; //если героя вынесли за пределы экрана
    }*/

    mainHero.onmouseup = function(event) {
      mainHeroCoordinates = playerCoordinates(mainHero);
      
      for (let key in enemyList) {
        let enemyCoord = enemyList[key]["coordinates"];
        //let enemy = document.getElementById(enemyList[key]["id"]);
        let enemy = enemyList[key];

        if ((mainHeroCoordinates["xL"] <= enemyCoord["xR"]) &&
         (mainHeroCoordinates["xR"] >= enemyCoord["xL"]) &&
         (mainHeroCoordinates["yT"] <= enemyCoord["yB"]) &&
         (mainHeroCoordinates["yB"] >= enemyCoord["yT"])) {
          battle(enemy);
        } else {
          document.querySelector('.game-over').classList.add('game-over--show');
        }
      }
      /*document.removeEventListener('mousemove', onMouseMove);
        mainHero.onmouseup = null;*/
    }

    function battle(elem) {
      console.log(elem);

      if (mainHeroS["points"] > elem["points"]) {
        mainHeroS["points"] = mainHeroS["points"] + elem["points"];
        console.log(mainHeroS["points"]);
        document.getElementById(mainHeroS["id"]).innerHTML = mainHeroS["points"];
        mainHeroS["coordinates"] = elem["coordinates"];
        document.getElementById(elem["id"]).hidden = true;
      }
    }
  });

  // ------ Functions ------

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

  