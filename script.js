document.addEventListener('DOMContentLoaded', () => {
   let board = null;
   const game = new Chess();
   const moveHistory = document.getElementById('move-history');
   let moveCounter = 1;
   let userColor = 'white';

   const makeRandomMove = () => {
    const possibleMoves = game.moves();

    if(game.game_over()){
        alert('Echec et Mat!');
    }else{
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const move = possibleMoves[randomIndex];
        game.move(move);
        board.position(game.fen());
        recordMove(move, moveCounter);
        moveCounter++;
    }
  };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} - `;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {

        return !game.game_over() && piece.search(userColor) !== 0;
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if(move === null){
            return 'snapback';
        }

        recordMove(move.san, moveCounter);
        moveCounter++;
        window.setTimeout(makeRandomMove, 250);
    };

    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    board = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCounter = 1;
        userColor = 'white';
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt('Entrer une position FEN valide');
        if(fen !== null){
            if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent = '';
                moveCounter = 1;
                userColor = 'white';
            }else{
                alert('Position FEN invalide. Veuillez réessayer!');
            }
            
        }
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        
        userColor = userColor === 'white' ? 'black' : 'white';
        if (userColor === 'black') {
            makeRandomMove();
        }
    });
});