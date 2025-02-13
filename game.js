const mainMenu = /*html*/ `
    <div class="menu_container">
        <div class="menu_content">
            <div class="game_title">Click O'clock</div>
            <button class="button menu_button" onclick="updateContent(gameplay)">start</button>
            <button class="button menu_button" onclick="updateContent(guide)">guide</button>
            <button class="button menu_button" onclick="updateContent(about)">about</button>
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
            <button class="game_exit" onclick="pauseOrExitGame(gameExit)"></button>
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
        <button class="button exit_window_button" onclick="resumeGameplay()">
            Continue
        </button>
        <button class="button exit_window_button" onclick="updateContent(mainMenu)">
            Exit
        </button>
    </div>
`;

let intervalID;

//This function pushes variable content into the game window.
function updateContent(param) {
    var divElement = document.getElementById('game_canvas');
    divElement.innerHTML = param;
    if(param === gameplay){
        initiateGameLogic();
    }
    if(param === mainMenu){
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
    clickableObject.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
}

//Pop-up for the exit to menu window that pauses the game.
function pauseOrExitGame(param) {
    var divElement = document.getElementById('game_exit_window');
    //Moved the pop-up window on top of the gameplay window.
    divElement.style.zIndex = '100';
    divElement.innerHTML = param;
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

    GridOn();

    document.getElementById('gameplay_window').addEventListener('click', () => {
        document.getElementById('press_to_play').style.display = 'none';
        clickableObject.style.display = 'block';
        clearInterval(intervalID);
        intervalID = setInterval(moveObject, 700);
    });
     
    if (!clickableObject) return;

    //Declaring variables for the score element.
    let scoreElement = document.getElementById('game_score');
    let scoreCounter = 0;

    //Displays the score from the very beginning of the game.
    scoreElement.innerText = scoreCounter;

    clickableObject.addEventListener('click', () => {
        //Adds up the points when the object is clicked and updates the score.
        scoreCounter += 100;
        scoreElement.innerText = scoreCounter;
        //Clears the object when its clicked and generates a new one.
        clearInterval(intervalID);
        moveObject();
        intervalID = setInterval(moveObject, 700);
    })
}

function FlexOn(){
    document.getElementById('game_canvas').style.display = "flex";
}

function GridOn(){
    document.getElementById('game_canvas').style.display = "grid";
}

//When the page is loaded, it displays the main menu.
addEventListener('DOMContentLoaded', (event) => {
    updateContent(mainMenu);
    FlexOn();
});

