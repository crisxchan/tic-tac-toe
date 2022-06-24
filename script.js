let playerFactory = (name, assignedXO, turn) => {
    return { name, assignedXO, turn };
};

let gameBoardModule = (() => {
    let gameBoard = new Array(9);
    const tiles = document.querySelectorAll('.tile');

    const initializeGameBoard = () => {
        for (let i=0; i < gameBoard.length; i++){
            tiles[i].addEventListener('click', markByPlayer);
            tiles[i].dataset.index = i;
            gameBoard[i] = tiles[i];
        }
    }

    const markByPlayer = (e) => { 
        let currentPlayer = gameFlowModule.getCurrentPlayer();
        e.target.innerHTML = currentPlayer.assignedXO;
        e.target.classList.add(currentPlayer.assignedXO);
        e.target.removeEventListener('click', markByPlayer);

        gameBoard[e.target.dataset.index] = currentPlayer.assignedXO;

        gameFlowModule.checkWinner(currentPlayer);
        gameFlowModule.setCurrentPlayer();
    }

    const resetGameBoard = () => {
        tiles.forEach(tile => {
            tile.removeEventListener('click', markByPlayer);
            tile.innerHTML = '';
            tile.className = 'tile';
        });
        initializeGameBoard();
    }

    return { gameBoard, initializeGameBoard, resetGameBoard };
})();

const displayController = (() => {
    const overlay = document.querySelector('.overlay');

    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        gameBoardModule.resetGameBoard();
    });

    const drawGame = () => {
        overlay.classList.add('active');
        overlay.innerHTML = 'DRAW'
    }

    const winGame = (winner) => {
        overlay.classList.add('active');
        overlay.innerHTML = `${winner}<br>WINS`
    }

    return { overlay, drawGame, winGame };
})();

const gameFlowModule = (() => {
    const playerA = playerFactory('chan', 'x', true);
    const playerB = playerFactory('jess', 'o', false);
    const gameBoard = gameBoardModule.gameBoard;

    const winningConditions = [
        [0, 1, 2], 
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const setCurrentPlayer = () => {
        if (displayController.overlay.classList.contains('active')) {
            playerA.turn = true;
            playerB.turn = false;
            return;
        }
        playerA.turn = !playerA.turn;
        playerB.turn = !playerB.turn;
    }

    const getCurrentPlayer = () => {
        return playerA.turn ? playerA : playerB;
    }

    const checkWinner = (player) => {
        for (let i=0; i<winningConditions.length; i++){
            let winCondition = winningConditions[i];
            const a = gameBoard[winCondition[0]];
            const b = gameBoard[winCondition[1]];
            const c = gameBoard[winCondition[2]];

            if (a == b && b == c) {
                gameEnd(player);
                return;
            }
        }
        
        if (checkIfDraw()) gameEnd();
    }

    const checkIfDraw = () => {
        const isDraw = gameBoard.every(element => {
            if (element === 'x' || element === 'o'){
                return true;
            }
        });

        return isDraw;
    }

    const gameEnd = (winner = '') => {
        switch(winner.name) {
            case playerA.name:
                displayController.winGame(playerA.assignedXO);
                break;

            case playerB.name:
                displayController.winGame(playerB.assignedXO);
                break;

            default:
                displayController.drawGame();
        }
    }

    gameBoardModule.initializeGameBoard();

    return { checkWinner, setCurrentPlayer, getCurrentPlayer }
})();


