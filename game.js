const mainMenu = /*html*/ `
    <div class="menu_container">
        <div class="menu_content">
            <div class="game_title">Click O'clock</div>
            <button class="menu_button" onclick="updateContent(gameplay)">start</button>
            <button class="menu_button" onclick="updateContent(rules), gridOn()">rules</button>
            <button class="menu_button" onclick="updateContent(about), gridOn()">about</button>
        </div>
    </div>
`;
const rules = /*html*/ `
        <div class="game_info_title">
            <div>
                <button class="menu_button game_exit" onclick="updateContent(mainMenu), flexOn()">
                   back
                </button>
            </div>
            <div>
                <h2>
                How to play Click O'clock
                </h2>
            </div>
        </div>
        <div class="game_info_text">
            <div>
                <h2>
                Game rules
                </h2>
                <p>
                    Click on the circles as they appear on the screen to earn points. Failing to click will result in a point deduction.
                    The faster you click, the higher your score! Keep playing to improve your reaction time and set a new high score.
                </p>
                 <p>
                    As you progress, the game becomes more challenging — the more points you earn, the smaller the objects become, 
                    making it harder to hit them. Stay sharp, click fast, and see how high you can score!
                </p>
            </div>
        </div>
`;

const about = /*html*/ `
    <div class="game_info_title">
        <div>
            <button class="menu_button game_exit" onclick="updateContent(mainMenu), flexOn()">
            back
            </button>
        </div>
        <div>
            <h2>
                Click O'clock-project
            </h2>
        </div>
    </div>
    <div class="game_info_text">
        <div>
            <h2>About the project</h2>
            <p>
                Click O’Clock is my first game (but hopefully not my last), and creating it has been an incredibly 
                rewarding experience. There were challenges along the way, but seeing it come together feels like a victory!
            </p>
            <p>
                This game was developed as part of a school project. The idea came to me while learning about CSS 
                animations, and I built it using only HTML, CSS, and JavaScript—no canvas involved!
            </p>
            <p>
                I look forward to improving the game based on your feedback!
            </p>
            <p>
                <a href="#feedback">Here's how you can leave feedback!</a>
            </p>
        </div>
    </div>
`;

const gameplay = /*html*/ `
    <div id="game_exit_window">
    </div>
    <div class="game_hud">
        <div>
            <button class="menu_button game_exit" onclick="pauseOrExitGame()">
                &#9208;
            </button>
        </div>
        <div>
            <div class="game_lives">
                <div id="life_1"></div>
                <div id="life_2"></div>
                <div id="life_3"></div>
            </div>
        </div>
        <div>
            <div id="game_score"></div>
        </div>
    </div>
    <div id="gameplay_window">
        <div id="press_to_play">
            Click to play!
        </div>
        <div id="game_over">
            Game over!
        </div>
        <div id="clickable_object"></div>
    </div> 
`;

const gameExit = /*html*/ `
    <div class="exit_popup_window">
        <div class="exit_window_text">
            Paused
        </div>
        <button class="menu_button exit_window_button" onclick="resumeGameplay()">
            Resume
        </button>
        <button class="menu_button exit_window_button" onclick="updateContent(mainMenu)">
            Exit game
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
        scoreCounter = 0;
        initiateGameLogic();
    }
    if (param === mainMenu) {
        flexOn();
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
    if (scoreCounter >= 5000) {
        root.style.setProperty('--clickableObject-size', '40px')
        clickableObject.style.background = '#e6844b';
    }
    else if (scoreCounter >= 3000) {
        root.style.setProperty('--clickableObject-size', '50px')
        clickableObject.style.background = 'red';
    }
    else if (scoreCounter >= 2000) {
        root.style.setProperty('--clickableObject-size', '65px')
        clickableObject.style.background = 'yellow';
    } else {
        clickableObject.style.background = '#469bf6';
        root.style.setProperty('--clickableObject-size', '75px')
    }
}

//Pop-up for the exit to menu window that pauses the game.
function pauseOrExitGame() {
    clearInterval(intervalID);
    var divElement = document.getElementById('game_exit_window');
    //Moved the pop-up window on top of the gameplay window.
    divElement.style.zIndex = '100';
    divElement.innerHTML = gameExit;

}

//Resumes the game after clicking continue-button.
function resumeGameplay() {
    var divElement = document.getElementById('game_exit_window');
    //Hides the pop-up window behind the gameplay window.
    divElement.style.zIndex = '0';
    //"Closes" the pop-up window.
    divElement.innerHTML = '';
    setNewInterval();
}

function setNewInterval(){
    clearInterval(intervalID);
    intervalID = setInterval(moveObject, 1200)
}

//Contains the gameplay functionality and mechanics.
function initiateGameLogic() {
    let life = 3;
        
    const clickableObject = document.getElementById('clickable_object')
    //Enable grid display for the game HUD.
    gridOn();

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
        moveObject();

        setNewInterval();
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
            setNewInterval();
        }
        else {
            life -= 1;
            setNewInterval();
            document.getElementById('life_3').style.display = 'none';
            
        }
        if(life === 0){
            clearInterval(intervalID);
            document.getElementById('game_over').style.display = 'block';
            clickableObject.style.display = 'none';
        }
    });
}

function flexOn() {
    document.getElementById('game_canvas').style.display = "flex";
}

function gridOn() {
    document.getElementById('game_canvas').style.display = "grid";
    console.log()
}

//When the page is loaded, it displays the main menu.
addEventListener('DOMContentLoaded', (event) => {
    updateContent(mainMenu);
    flexOn();
});

