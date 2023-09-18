function promiseAfterTimeout(seconds) {
    return new Promise(function (resolve) {
      setTimeout(() => resolve(), seconds*1100);
    });
  }
  
  function rotateWheel(degr) {
    let wheel = document.querySelector('.wheel');
    wheel.style.transform = 'rotate(-'+degr+'deg)';
    return promiseAfterTimeout(3);
  }
  
  function randomDegrees() {
    let randomFloat = Math.random()*4720;
    let descreetDegrees = Math.round(randomFloat / 72) * 72;
    return descreetDegrees;
  }
  
  function getCurrentColor(currentDegrees) {
    let numbers = ["0", "50", "100", "150", "200", "250", "300", "350", "400", "450"];
    let segmentCount = parseInt(currentDegrees/36);
    let segmentShift = segmentCount % numbers.length;
    
    return numbers[segmentShift];
    
  }
  
  function launchSpin() {
    currentRotation += randomDegrees();
    
    rotateWheel(currentRotation)
      .then(() => {
        let winNumber = getCurrentColor(currentRotation);
        let result = document.querySelector('.result');
        let title = document.querySelector('.title');
        let modal = document.querySelector('.modal')
        let remove = document.querySelector('.remove')
        modal.classList.add('active')
        remove.addEventListener('click', function () {
            modal.classList.remove('active')
          })
          if (winNumber == 0) {
            title.innerHTML = 'Ничего,повезет в следующий раз';
            remove.innerHTML = 'Эх,ну ладно!';
          } else {
            title.innerHTML = 'Поздравляем вы выиграли';
            remove.innerHTML = 'Ура,спасибо!';
          }
        result.innerHTML = `+${winNumber}`;
      });
  }
  
  let currentRotation = 0;
  let spinButton = document.querySelector('.spin');
  spinButton.addEventListener('click', launchSpin);



  let remove = document.querySelector('.remove')
