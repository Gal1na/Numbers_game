;(function(){
  const mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);

  let mainHero = document.querySelector('#mainHero');
  let playField = document.querySelector('.js-play-field');
  
  let enemyList = {};
  let kolEnemy = 4;
  let pointsEnemy = [];

  let pointsMainHero = getRandomInt(2, 10);
  let mainHeroCoordinates = getCoordinatesPlayer(mainHero);
  let mainHeroS = {
        "id" : "mainHero",
        "points": pointsMainHero,
        "coordinates": mainHeroCoordinates,
      }

  let maxHeight = playField.getBoundingClientRect().height;
  let maxWidth = playField.getBoundingClientRect().width;  

  document.addEventListener("DOMContentLoaded", function(){
   
    mainHero.innerHTML = pointsMainHero;

    countPoints();    
    createEnemyList();    
    writePointsEnemy();
    
    function drag() {
      let shiftX = mobile ?
      e.touches[0].clientX - mainHero.getBoundingClientRect().left :
      event.clientX - mainHero.getBoundingClientRect().left; 

      let shiftY = mobile ?
      e.touches[0].clientY - mainHero.getBoundingClientRect().top :
      event.clientY - mainHero.getBoundingClientRect().top;      

      function position(pageX, pageY) {
        let posX = pageX - shiftX;
        let posY = pageY - shiftY;

        if (posX + 50 > maxWidth) {posX = maxWidth - 50;}
        if (posY + 50 > maxHeight) {posY = maxHeight - 50;}
        if (posX < 0) {posX = 0;}
        if (posY < 0) {posY = 0;}

        mainHero.style.left = posX + 'px';
        mainHero.style.top = posY + 'px';
      };

      function moveAt(e) {
        let x = mobile ? e.touches[0].clientX : e.clientX;
        let y = mobile ? e.touches[0].clientY : e.clientY;
        position(x,y);
      };

      function drop() {
        if (mobile) {
          document.removeEventListener("touchmove", moveAt);
        } else {
          document.removeEventListener('mousemove', moveAt);
        }
        
        locationMainHero();
        if (isEmpty(enemyList)) {
          document.querySelector('.victory').classList.add('victory--show');
          document.querySelector('.game-over').classList.add('game-over--show');
        }

        if (mobile) {
          document.addEventListener("touchend", drop);
        } else {
          document.removeEventListener('mousemove', drop);
        }        
      }
    
      // Add event listeners
      if (mobile) {
        document.addEventListener("touchmove", moveAt);
        document.addEventListener("touchend", drop);
      } else {
        document.addEventListener('mousemove', moveAt);
        document.addEventListener("mouseup", drop);
      }
    };

    // Add event listeners
    if (mobile) {
      mainHero.addEventListener("touchstart", drag);
    } else {
      mainHero.addEventListener('mousedown', drag);
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
    let minWidth = maxWidth * 0.2 + 50;
    let x_position = getRandomInt(minWidth - 1, maxWidth);
    if (x_position > maxWidth - 50) {
      x_position = x_position - 50;
    }
    return x_position;
  }

  //Get random Y coordinates of the browser window
  function getYPositionOfEnemy() {
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