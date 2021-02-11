;(function(){

  $(document).ready(function() {
    let main = document.querySelector('.js-main');
    let enemy1 = document.querySelector('.js-hero-enemy-1');
    let enemy2 = document.querySelector('.js-hero-enemy-2');
    let enemy3 = document.querySelector('.js-hero-enemy-3');
    let pointsMain;
    let pointsEnemy1;
    let pointsEnemy2;
    let pointsEnemy3;

    pointsMain = getRndInteger(2, 10);
    pointsEnemy1 = getRndInteger(1, pointsMain);
    pointsEnemy2 = getRndInteger(pointsEnemy1 + 1, pointsMain + pointsEnemy1);
    pointsEnemy3 = getRndInteger(pointsEnemy2 + 1, pointsMain + pointsEnemy1 + pointsEnemy2);

    main.innerHTML = pointsMain;
    enemy1.innerHTML = pointsEnemy1;
    enemy2.innerHTML = pointsEnemy2;
    enemy3.innerHTML = pointsEnemy3;

    main.ondragstart = function() {
      return false;
    };

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentenemy = null;
    let mainCoordinates = {};
    let enemy1Coordinates = {};
    let enemy2Coordinates = {};
    let enemy3Coordinates = {};

    enemy1Coordinates = playerCoordinates(enemy1);
    enemy2Coordinates = playerCoordinates(enemy2);
    enemy3Coordinates = playerCoordinates(enemy3);

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
    
    main.onmousedown = function(event) {

      let shiftX = event.clientX - main.getBoundingClientRect().left; //коорд курсора в герое
      let shiftY = event.clientY - main.getBoundingClientRect().top;  //коорд курсора в герое

      main.style.zIndex = 1000;

      moveAt(event.pageX, event.pageY);

      //координаты верхнего левого угла героя (xLeft,yTop)
      function moveAt(pageX, pageY) {
        main.style.left = pageX - shiftX + 'px';
        main.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        mainCoordinates = playerCoordinates(main);
        //console.log(mainCoordinates);

        for (let key in enemyList) {
          let enemyCoord = enemyList[key]["coordinates"];
          let enemy = document.getElementById(enemyList[key]["id"]);
         // console.log(enemyCoord);

          if ((mainCoordinates["xL"] <= enemyCoord["xR"]) &&
              (mainCoordinates["xR"] >= enemyCoord["xL"]) &&
              (mainCoordinates["yT"] <= enemyCoord["yB"]) &&
              (mainCoordinates["yB"] >= enemyCoord["yT"])) {

            enemy.style.background = 'yellow';
          }


      }

              


        main.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY); // элемент, где координаты курсора на поле (не на герое)
        main.hidden = false;

        if (!elemBelow) return; //если героя вынесли за пределы экрана

        let enemy = elemBelow.closest('.hero--enemy'); //

        currentenemy = enemy;
        if (currentenemy) {
          // логика обработки процесса, когда мы "влетаем" в элемент droppable
          enterDroppable(currentenemy);
        }
      }

      document.addEventListener('mousemove', onMouseMove);

      main.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        main.onmouseup = null;
      };
    }    

    function enterDroppable(elem) {
      elem.style.background = 'pink';
      console.log(elem);

      playerCoordinates(elem); //координаты противника
      playerCoordinates (main); //координаты героя

      pointsMain = pointsMain + parseInt(elem.innerText);
      elem.hidden = true;
      console.log(pointsMain);
      main.innerHTML = pointsMain;

      
    }
  });

  function playerCoordinates (el) {
    let xLeft = el.getBoundingClientRect().left;
    let xRight = el.getBoundingClientRect().right;
    let yTop = el.getBoundingClientRect().top;
    let yBottom = el.getBoundingClientRect().bottom;

    /*let coordinates = {
      "LT": {x: xLeft, y: yTop},
      "RT": {x: xRight, y: yTop},
      "LB": {x: xLeft, y: yBottom},
      "RB": {x: xRight, y: yBottom},
    };*/

    let coordinates = {
      "xL" : xLeft,
      "xR" : xRight,
      "yT" : yTop,
      "yB": yBottom,
    };

    return coordinates;
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
})();

  