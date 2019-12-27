var fs = require('fs');

class Board {

    constructor(letters) {
        this.cells = [];

        letters.split('\n')
            .forEach((letters, row) => {
                letters.split('')
                .forEach((letter, col) => {
                    this.cells.push(new Cell(row, col, letter))
                })
            })

        this.cells.forEach(cell => {
            cell.adjacentCells = this.getAdjacentCells(cell);
        })

    }

    getCellsWithLetter(letter, source = this.cells, exclude = []) {
        return source.filter(cell => cell.letter === letter && !exclude.includes(cell))
    }

    getCellFromCords(row, col) {
        return this.cells.find(cell => {
            return cell.row === row && cell.col === col;
        })
    }

    getAdjacentCells(cell) {
        let adjacentCells = [];
        for (let row = cell.row - 1; row <= cell.row + 1; row++) {
            for (let col = cell.col - 1; col <= cell.col + 1; col++) {
                let adjacentCell = this.getCellFromCords(row, col);
                if (adjacentCell && adjacentCell !== cell) {
                    adjacentCells.push(adjacentCell);
                }
            }
        }
        return adjacentCells;
    }

    findWordPath(word, source = this.cells, path = []) {
        const checkLetter = word[0];
        const remainingLetters = word.slice(1);

        // Get all the cells that start with the first letter
        const matchingCells = this.getCellsWithLetter(checkLetter, source, path);

        if (remainingLetters.length == 0 && matchingCells[0]) {
            path.push(matchingCells[0]);
            return path; 
        }

        for (let cell of matchingCells) {
            // Test the remaining letters
            const testCell = this.findWordPath(remainingLetters, cell.adjacentCells, path.concat([cell]))

            if (testCell) {
                return testCell; 
            }
        }

        return;
    }
}

class Cell {
    constructor(row, col, letter) {
        this.row = row; 
        this.col = col; 
        this.letter = letter;
        this.adjacentCells = [];
    }
}

const boardLetters = 
`taihe
wsnrm
laoht
hoult
nrabh`

const board = new Board(boardLetters);


const wordsListDir = 'words-scrabble.txt';
const words = fs.readFileSync(wordsListDir, 'utf8').split("\n")
    .filter(word => word.length >= 3);


const foundWords = [];

words.forEach(word => {
    const path = board.findWordPath(word);
    if (path) {
        foundWords.push({
            word: word, 
            path: path
        });
    }
})

console.log(`${foundWords.length} words found`)

foundWords.forEach(word => {
    console.log(word.word)
})


// console.log(foundWords[50].path)


// console.log(board.findWordPath('barn'));


