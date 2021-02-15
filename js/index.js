console.log('欢迎来到dcsuibian的练手2048项目，侵删')

class Chessboard {
  #size
  #grids

  constructor(size = 4) {
    this.#size = size
    this.#grids=this.#createGrids(4,null)
  }

  * traversal(direction) {
    switch (direction) {
      case 'up': {
        for (let j = 0; j < this.#size; j++) {
          for (let i = 0; i < this.#size; i++) {
            yield [i, j]
          }
        }
      }
        break;
      case 'right': {
        for (let i = 0; i < this.#size; i++) {
          for (let j = this.#size - 1; j >= 0; j--) {
            yield [i, j]
          }
        }
      }
        break;
      case 'down': {
        for (let j = 0; j < this.#size; j++) {
          for (let i = this.#size - 1; i >= 0; i--) {
            yield [i, j]
          }
        }
      }
        break;
      case null:
      case 'left': {
        for (let i = 0; i < this.#size; i++) {
          for (let j = 0; j < this.#size; j++) {
            yield [i, j]
          }
        }
      }
        break;
    }
    return;
  }

  #isLegal(i,j){
    return i>=0&&i<this.#size&&j>=0&&j<this.#size;
  }

  #createGrids(size,value=null){
    const grids = []
    for (let i = 0; i < this.#size; i++) {
      const row = []
      for (let j = 0; j < this.#size; j++) {
        row.push(null)
      }
      grids.push(row)
    }
    return grids
  }

  #move(direction) {
    const posGen = this.traversal(direction)
    const forwards = {
      up: [-1, 0],
      right: [0, 1],
      down: [1, 0],
      left: [0, -1],
    }
    const f = forwards[direction]
    const grids=this.#grids
    const flagGrids=this.#createGrids(this.#size,null)
    for (let p of posGen) {
      while (true){
        grids[]
        p=
      }
    }
    return;
  }

  up() {
    console.log('↑')
    this.#move('up')
  }

  right() {
    console.log('→')
    this.#move('right')
  }

  down() {
    console.log('↓')
    this.#move('down')
  }

  left() {
    console.log('←')
    this.#move('left')
  }

  #randomEmptyPosition() {
    const choices = []
    for (let i = 0; i < this.#size; i++) {
      for (let j = 0; j < this.#size; j++) {
        if (null !== this.#grids[i][j]) {
          choices.push([i, j])
        }
      }
    }
    return choices[Math.floor(Math.random() * choices.length)]
  }
}

const chessboard = new Chessboard();

//为键盘方向键增加监听事件
document.body.addEventListener('keyup', e => {
  switch (e.code) {
    case 'ArrowUp':
      chessboard.up();
      break;
    case 'ArrowRight':
      chessboard.right();
      break;
    case 'ArrowDown':
      chessboard.down();
      break;
    case 'ArrowLeft':
      chessboard.left();
      break;
  }
  e.preventDefault()
}, false)
