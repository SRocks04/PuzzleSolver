class SudokuGame {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initializeGame();
    }

    initializeGame() {
        const puzzle = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];
        this.grid = puzzle.map(row => [...row]);
        this.solution = this.solveSudoku([...puzzle.map(row => [...row])]);
    }

    isValid(num, pos, board) {
        const [row, col] = pos;

        for(let x = 0; x < 9; x++) {
            if(board[row][x] === num && x !== col) {
                return false;
            }
        }

        for(let x = 0; x < 9; x++) {
            if(board[x][col] === num && x !== row) {
                return false;
            }
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for(let i = boxRow; i < boxRow + 3; i++) {
            for(let j = boxCol; j < boxCol + 3; j++) {
                if(board[i][j] === num && (i !== row || j !== col)) {
                    return false;
                }
            }
        }

        return true;
    }

    findEmpty(board) {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    solveSudoku(board) {
        let find = this.findEmpty(board);
        if(!find) {
            return board;
        }

        const [row, col] = find;

        for(let num = 1; num <= 9; num++) {
            if(this.isValid(num, [row, col], board)) {
                board[row][col] = num;

                if(this.solveSudoku(board)) {
                    return board;
                }

                board[row][col] = 0;
            }
        }

        return false;
    }

    getValidNumbers(row, col) {
        const validNums = [];
        for(let num = 1; num <= 9; num++) {
            if(this.isValid(num, [row, col], this.grid)) {
                validNums.push(num);
            }
        }
        return validNums;
    }

    isComplete() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(this.grid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}

class SudokuUI {
    constructor() {
        this.game = new SudokuGame();
        this.cells = Array(9).fill().map(() => Array(9));
        this.initializeUI();
    }

    initializeUI() {
        const table = document.getElementById('sudoku');

        for(let i = 0; i < 9; i++) {
            const row = table.insertRow();
            for(let j = 0; j < 9; j++) {
                const cell = row.insertCell();
                cell.className = 'cell';

                if(j === 2 || j === 5) {
                    cell.classList.add('block-border-right');
                }
                if(i === 2 || i === 5) {
                    cell.classList.add('block-border-bottom');
                }

                const value = this.game.grid[i][j];
                if(value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('prefilled');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'cell-input';
                    input.maxLength = 1;

                    const validNumbers = document.createElement('div');
                    validNumbers.className = 'valid-numbers';
                    validNumbers.textContent = `Valid: ${this.game.getValidNumbers(i, j).join(', ')}`;

                    cell.appendChild(input);
                    cell.appendChild(validNumbers);

                    // Storing the reference to the cell for easy access
                    this.cells[i][j] = {
                        input,
                        validNumbers
                    };

                    input.addEventListener('input', (e) => {
                        const num = parseInt(e.target.value);
                        if(isNaN(num)) {
                            e.target.value = '';
                            this.game.grid[i][j] = 0;
                            this.updateAllValidNumbers();
                            return;
                        }

                        if(!this.game.isValid(num, [i, j], this.game.grid)) {
                            alert('Not valid!');
                            e.target.value = '';
                            this.game.grid[i][j] = 0;
                            this.updateAllValidNumbers();
                            return;
                        }

                        this.game.grid[i][j] = num;
                        this.updateAllValidNumbers();

                        if(this.game.isComplete()) {
                            alert('Congratulations! You solved the puzzle!');
                        }
                    });
                }
            }
        }
    }

    updateAllValidNumbers() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(this.cells[i][j]) { // If it's an empty cell
                    const validNums = this.game.getValidNumbers(i, j);
                    this.cells[i][j].validNumbers.textContent = `Valid: ${validNums.join(', ')}`;
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SudokuUI();
});