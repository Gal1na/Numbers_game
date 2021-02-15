;(function(){
  const HERO_SIZE = 50;

  let mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);  

  let playField = document.querySelector('.js-play-field');
  let playFieldHeight = playField.getBoundingClientRect().height;
  let playFieldWidth = playField.getBoundingClientRect().width; 
  
  let mainHero = document.querySelector('#mainHero');
  let mainHeroPoints = getRandomInt(2, 10);
  let mainHeroCoordinates = getCoordinatesPlayer(mainHero);
  
  let enemiesAmount = 5;
  let enemiesList = {};  
  let enemiesPoints = [];     

  document.addEventListener("DOMContentLoaded", function(){
   
    mainHero.innerHTML = mainHeroPoints;

    createEnemiesPoints();    
    createEnemyList();    
    
    function drag(event) {
      // Disabling Drag'n'Drop Browser
      mainHero.ondragstart = function() {
        return false;
      };
      event.preventDefault();

      let shiftX = mobile
        ? event.touches[0].clientX - mainHero.getBoundingClientRect().left
        : event.clientX - mainHero.getBoundingClientRect().left; 

      let shiftY = mobile
        ? event.touches[0].clientY - mainHero.getBoundingClientRect().top
        : event.clientY - mainHero.getBoundingClientRect().top;      

      function moveAt(e) {
        let x = mobile ? e.touches[0].clientX : e.clientX;
        let y = mobile ? e.touches[0].clientY : e.clientY;
        moveMainHero(x,y,shiftX,shiftY);
      };

      moveAt(event);

      function drop() {
        if (mobile) {
          document.removeEventListener("touchmove", moveAt);
        } else {
          document.removeEventListener('mousemove', moveAt);
        }
        
        locationMainHero();

        if (isEmpty(enemiesList)) {
          document.querySelector('.victory').classList.add('victory--show');
          document.querySelector('.game-over').classList.add('game-over--show');
        }

        if (mobile) {
          document.removeEventListener("touchend", drop);
        } else {
          document.removeEventListener('mouseup', drop);
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
      mainHero.addEventListener("touchstart", drag, { passive: false });
    } else {
      mainHero.addEventListener('mousedown', drag);
    };
  });

  // ------ Functions ------

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  //Get random X coordinates of an enemy
  function getXPositionOfEnemy() {
    let widthFieldMainHero = playFieldWidth * 0.2 + HERO_SIZE;
    let x_position = getRandomInt(widthFieldMainHero, playFieldWidth);
    if (x_position > playFieldWidth - HERO_SIZE) {
      x_position = x_position - HERO_SIZE;
    }
    return x_position;
  }

  //Get random Y coordinates of an enemy
  function getYPositionOfEnemy() {
    let y_position = getRandomInt(0, playFieldHeight);

    if (y_position > playFieldHeight - HERO_SIZE) {
      y_position = y_position - HERO_SIZE;
    } 
    return y_position;
  }

  // Create an enemy
  function createEnemy(n) {
    let enemy = document.createElement('div');

    enemy.classList.add('hero', 'hero--enemy', 'js-enemy-' + n);
    enemy.style.left = getXPositionOfEnemy() + 'px';
    enemy.style.top = getYPositionOfEnemy() + 'px';
    playField.append(enemy);
    return enemy;
  }

  // Create an array of enemy points
  function createEnemiesPoints() {
    let sum = 0;
    enemiesPoints[0] = getRandomInt(1, mainHeroPoints);

    for (let i = 1; i <= enemiesAmount - 1; i++) {
      sum = sum + enemiesPoints[i - 1];
      enemiesPoints[i] = getRandomInt(enemiesPoints[i - 1] + 1, mainHeroPoints + sum);
    }
  }        

  // Create a list of enemies
  function createEnemyList() {
    for (let i = 1; i <= enemiesAmount; i++) {
      enemiesList[i] = { "class" : "js-enemy-" + i,
                  "points" : enemiesPoints[i - 1],
                  "coordinates" : getCoordinatesPlayer(createEnemy(i)),
      };
      document.querySelector('.' + enemiesList[i]["class"]).innerHTML = enemiesList[i]["points"];
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

  // Position mainHero when moving
  function moveMainHero(pageX, pageY, offsetX, offsetY) {
    let posX = pageX - offsetX;
    let posY = pageY - offsetY;

    if (posX + HERO_SIZE > playFieldWidth) {
      posX = playFieldWidth - HERO_SIZE;
    } else {
      if (posX < 0) {posX = 0;}
    }
    if (posY + HERO_SIZE > playFieldHeight) {
      posY = playFieldHeight - HERO_SIZE;
    } else {
      if (posY < 0) {posY = 0;}
    }
    
    mainHero.style.left = posX + 'px';
    mainHero.style.top = posY + 'px';
  };

  // Determining the location of the mainHero
  function locationMainHero() {
    mainHeroCoordinates = getCoordinatesPlayer(mainHero);
    for (let key in enemiesList) {
      let enemyCoord = enemiesList[key]["coordinates"];
      let enemy = enemiesList[key];
      
      if ((mainHeroCoordinates["xL"] <= enemyCoord["xR"]) &&
       (mainHeroCoordinates["xR"] >= enemyCoord["xL"]) &&
       (mainHeroCoordinates["yT"] <= enemyCoord["yB"]) &&
       (mainHeroCoordinates["yB"] >= enemyCoord["yT"])) {
        battle(enemy);
        delete(enemiesList[key]);
        return;
      } 
    }
  }

  // Battle
  function battle(rival) {
    
    if (mainHeroPoints > rival["points"]) {
      mainHeroPoints = mainHeroPoints + rival["points"];
      mainHero.innerHTML = mainHeroPoints;

      mainHero.style.left = rival["coordinates"]["xL"] +'px';
      mainHero.style.top = rival["coordinates"]["yT"] + 'px';

      document.querySelector('.' + rival["class"]).remove();
    } else {
      rival["points"] = rival["points"] + mainHeroPoints;
      mainHero.hidden = true;
      document.querySelector('.game-over').classList.add('game-over--show');
    }
  }

  // Checking for an empty object
  function isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }  
})();  