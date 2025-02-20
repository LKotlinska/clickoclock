const mainMenu = /*html*/ `
    <div class="menu_container">
        <div class="menu_content">
            <div class="game_title">Click O'clock</div>
            <button class="menu_button" onclick="updateContent(gameplay)">start</button>
            <button class="menu_button" onclick="updateContent(rules), GridOn()">rules</button>
            <button class="menu_button" onclick="updateContent(about), GridOn()">about</button>
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
                    Click on the objects as they appear on the screen to earn points. Each object stays visible for 
                    a short duration—if you don’t click it in time, it will disappear and respawn in a new location. 
                    The faster you click, the higher your score! Keep playing to improve your reaction time and set a new high score.
                </p>
            </div>
            <div>
                <h2>Objective</h2>
                <p>
                    <ul>
                        <li>Collect as many points as possible by clicking the object.</li>
                        <li>Failing to click the object will result in a point deduction.</li>
                        <li>Practice to improve your reaction time and accuracy.</li>
                    </ul>
                    <p>
                        As you progress, the game becomes more challenging — the more points you earn, the smaller the objects become, 
                        making it harder to hit them. Stay sharp, click fast, and see how high you can score!
                    </p>
                    <p>
                        Don't forget to have fun!
                    </p>
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
            <h2>About the developer</h2>
            <p>
                Hello! I’m Laura, a web development enthusiast with life-long interest in gaming. 
                This is my first game (and hopefully not the last), and I must say that creating 
                Click O'clock has been an incredibly rewarding experience. There were definitely challenges 
                along the way, but seeing it all come together feels like a victory!
            </p>
            <p>
                I'm looking forward to improving the game based on your feedback!
            </p>
            <p>
                <a href="#feedback">Here's how you can leave feedback!</a>
            </p>
        </div>
        <div>
            <h2>About the project</h2>
            <p>
                This game is created as part of a school project. The idea came to me when learning 
                about CSS animations, and I decided to build the game using only HTML, CSS, 
                and JavaScript—no canvas involved! This project has been the perfect opportunity to apply my skills on a larger scale, 
                as it’s my biggest project so far. 
            </p>
        </div>
    </div>
`;

const gameplay = /*html*/ `
    <div id="game_exit_window">
    </div>
    <div class="game_hud">
        <div>
            <button class="game_exit menu_button" onclick="pauseOrExitGame()">
                pause
            </button>
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
    intervalID = setInterval(moveObject, 700)
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

