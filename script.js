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
        let currentPlayer = gameFlowModule.playerA.turn ? gameFlowModule.playerA : gameFlowModule.playerB;

        e.target.innerHTML = currentPlayer.assignedXO;
        e.target.removeEventListener('click', markByPlayer);
        gameBoard[e.target.dataset.index] = currentPlayer.assignedXO;

        gameFlowModule.checkWinner(currentPlayer);
        gameFlowModule.playerA.turn = !gameFlowModule.playerA.turn;
        gameFlowModule.playerB.turn = !gameFlowModule.playerB.turn;
    }

    return { gameBoard, initializeGameBoard };
})();

var gameFlowModule = (() => {
    const playerA = playerFactory('chan', 'x', true);
    const playerB = playerFactory('jess', 'o', false);
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

    const checkWinner = (player) => {
        const gameBoard = gameBoardModule.gameBoard;
        
        for (let i=0; i<winningConditions.length; i++){
            let winCondition = winningConditions[i];
            const a = gameBoard[winCondition[0]];
            const b = gameBoard[winCondition[1]];
            const c = gameBoard[winCondition[2]];

            if (a == b && b == c) {
                console.log(`${player.name} WON`);
            }
        }

    }

    gameBoardModule.initializeGameBoard();

    return { playerA, playerB, checkWinner }
})();


