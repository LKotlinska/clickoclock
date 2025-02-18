const mainMenu = /*html*/ `
    <div class="menu_container">
        <div class="menu_content">
            <div class="game_title">Click O'clock</div>
            <button class="menu_button" onclick="updateContent(gameplay)">start</button>
            <button class="menu_button" onclick="updateContent(guide)">guide</button>
            <button class="menu_button" onclick="updateContent(about)">about</button>
        </div>
    </div>
`;
const guide = /*html*/ `
    <h1>Hello</h1>
`;

const about = /*html*/ `
    <h1>Hello</h1>
`;

const gameplay = /*html*/ `
    <div id="game_exit_window">
    </div>
    <div class="game_hud">
        <div>
            <button class="game_exit menu_button" onclick="pauseOrExitGame()">exit</button>
        </div>
        <div>
            <div id="game_score"></div>
        </div>
    </div>
    <div id="gameplay_window">
        <div id="press_to_play">
            Click to play!
        </div>
        <div id="clickable_object"></div>
    </div>
    
`;

const gameExit = /*html*/ `
    <div class="exit_popup_window">
        <div class="exit_window_text">
            Are you sure you want to leave the game?
        </div>
        <button class="menu_button exit_window_button" onclick="resumeGameplay()">
            Continue
        </button>
        <button class="menu_button exit_window_button" onclick="updateContent(mainMenu)">
            Exit
        </button>
    </div>
`;


let scoreElement;
let scoreCounter = 0;

let intervalID;
const clickableObject = document.getElementById('clickable_object')
//This function pushes variable content into the game window.
function updateContent(param) {
    var divElement = document.getElementById('game_canvas');
    divElement.innerHTML = param;
    if (param === gameplay) {
        initiateGameLogic();
    }
    if (param === mainMenu) {
        FlexOn();
    }
}

//Code for the clickable object making it randomly appear on the screen.
function moveObject() {
    const clickableObject = document.getElementById('clickable_object')
    //Gets the parent element of the clickable object and their height and width.
    const parent = clickableObject.parentElement;
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;

    //Calculates random positions within the parent's dimensions, considering the size of the clickable object.
    let randomX = Math.random() * (parentWidth - clickableObject.offsetWidth);
    let randomY = Math.random() * (parentHeight - clickableObject.offsetHeight);

    //Repositions clickable object.
    clickableObject.style.left = randomX + 'px';
    clickableObject.style.top = randomY + 'px';

    let root = document.querySelector(':root');
    if(scoreCounter >= 5000){
        root.style.setProperty('--clickableObject-size', '40px')
        clickableObject.style.background = '#e6844b';
    }
    else if(scoreCounter >= 3000){
        root.style.setProperty('--clickableObject-size', '50px')
        clickableObject.style.background = 'red';
    }
    else if(scoreCounter >= 2000){
        root.style.setProperty('--clickableObject-size', '65px')
        clickableObject.style.background = 'yellow';
    }else{
        clickableObject.style.background = '#469bf6';
        root.style.setProperty('--clickableObject-size', '75px')
    }
}

//Pop-up for the exit to menu window that pauses the game.
function pauseOrExitGame() {
    var divElement = document.getElementById('game_exit_window');
    //Moved the pop-up window on top of the gameplay window.
    divElement.style.zIndex = '100';
    divElement.innerHTML = gameExit;
    clearInterval(intervalID);
}

//Resumes the game after clicking continue-button.
function resumeGameplay() {
    var divElement = document.getElementById('game_exit_window');
    //Hides the pop-up window behind the gameplay window.
    divElement.style.zIndex = '0';
    //"Closes" the pop-up window.
    divElement.innerHTML = '';
    intervalID = setInterval(moveObject, 700);
}

//Contains the gameplay functionality and mechanics.
function initiateGameLogic() {

    const clickableObject = document.getElementById('clickable_object')
    //Enable grid display for the game HUD.
    GridOn();

    //Guard clause - only runs when there's the object present.
    if (!clickableObject) return;

    scoreElement = document.getElementById('game_score');

    //Displays the score from the very beginning of the game.
    scoreElement.innerText = scoreCounter;

    clickableObject.addEventListener('mousedown', (event) => {
        //Disables clicking on the parent.
        event.stopPropagation();

        //Adds up the points when the object is clicked and updates the score.
        scoreCounter += 100;
        scoreElement.innerText = scoreCounter;

        //Clears the object when its clicked and generates a new one.
        clearInterval(intervalID);
        moveObject();
        
        intervalID = setInterval(moveObject, 700);
    })

    //Accesses the exit menu with an assigned keyboard shortcut.
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            pauseOrExitGame();
        }
    });

    document.getElementById('gameplay_window').addEventListener('mousedown', () => {
        let pressToPlay = document.getElementById('press_to_play');
        if (pressToPlay.style.display !== 'none') {
            pressToPlay.style.display = 'none';
            clickableObject.style.display = 'block';
            intervalID = setInterval(moveObject, 700);
        }
        else {
            scoreCounter -= 100;
            scoreElement.innerText = scoreCounter;
        }
    });

}

function FlexOn() {
    document.getElementById('game_canvas').style.display = "flex";
}

function GridOn() {
    document.getElementById('game_canvas').style.display = "grid";
}

//When the page is loaded, it displays the main menu.
addEventListener('DOMContentLoaded', (event) => {
    updateContent(mainMenu);
    FlexOn();
});

