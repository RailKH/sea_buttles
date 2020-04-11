const messageArea = document.querySelector('.messageArea');
const fireButton = document.querySelector('.fireButton');
const cellTable = document.querySelectorAll('td');

fireButton.addEventListener('click', ()=>{
    const quessInput = document.querySelector('.quessInput');

    let quess = quessInput.value;
    controller.processGuess(quess);
    quessInput.value = '';
});

cellTable.forEach(item => {
    item.addEventListener('click', e => {
        // console.log(typeof e.target.id);
        controller.processFire(e.target.id);
    });
})


const view = {
    displayMessage: msg =>{
        messageArea.textContent = msg;
    },
    displayHit: function(location){
        const cell = document.getElementById(location);
        cell.classList.add("hit");
    },
    displayMiss: function(location){
        const cell = document.getElementById(location);
        cell.classList.add("miss");
    }

}

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    
    ships: [
        { locations: [0,0,0], hits: ['','','']},
        { locations: [0,0,0], hits: ['','','']},
        { locations: [0,0,0], hits: ['','','']},
    ],

    fire: function(quess){
        for(let i = 0; i < this.numShips; i++){
            let index = this.ships[i].locations.indexOf(quess);
            if( index >= 0){
                this.ships[i].hits[index] = 'hit';
                view.displayHit(quess);
                view.displayMessage('HIT!');
                if(this.iaSunk(this.ships[i])){
                    this.shipsSunk++;
                    view.displayMessage('Потопил корабль');

                }
              return true;
            }
        }
        view.displayMiss(quess);
        view.displayMessage('Промах');
        return false;
    },

    iaSunk: function(ship){
        for(let i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        let locations;
        for(let i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function(){
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        let newShipLOcations = [];
        for(let i = 0; i < this.shipLength; i++){
            if(direction === 1){
                newShipLOcations.push(row + '' + (col + i));
            } else {
                newShipLOcations.push((row + i) + '' + col);

            }
        }
        return newShipLOcations;
    },

    collision: function(locations){
        for(let i = 0; i < this.numShips; i++){
            let ship = model.ships[i];
            for(let j = 0; j < locations.length; j++){
            if(ship.locations.indexOf(locations[j]) >= 0){
                return true;
            }
            }

        }
        return false;
    }
}

function parseGuess(quess){
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if(quess === null || quess.length !==2) {
        alert('Oops');
    } else {
        firstChar = quess[0];
        let row = alphabet.indexOf(firstChar);
        let column = quess[1];
            if(isNaN(row) || isNaN(column)){
    
                alert('Oops');
    
            } else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
    
                alert('Oops');
    
            } else {
    
                return row + column;
        }
    }
    return null;
}

const controller = {
    guesses: 0,
    processGuess: function(guess){
        let location = parseGuess(guess);
        if(location){
            this.guesses++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("Cool!");
            }
        }
    },
    processFire: function(location){
        this.guesses++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("Cool!");
            }
    }
}

model.generateShipLocations();
