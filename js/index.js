'use strict';
const moveTime = 0.25
const newTime = 0.125

//代码一律只考虑正方形
class Utils {
  static createGrids(size, value = null) {
    const grids = []
    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(null)
      }
      grids.push(row)
    }
    return grids
  }

  static copyGrids(oldGrids) {
    const grids = []
    for (let i = 0; i < oldGrids.length; i++) {
      const row = []
      for (let j = 0; j < oldGrids[i].length; j++) {
        row.push(oldGrids[i][j])
      }
      grids.push(row)
    }
    return grids
  }

  static randomEmptyPosition(grids) {
    const choices = []
    for (let i = 0; i < grids.length; i++) {
      for (let j = 0; j < grids[i].length; j++) {
        if (null === grids[i][j]) {
          choices.push([i, j])
        }
      }
    }
    return choices[Math.floor(Math.random() * choices.length)]
  }
}


class Chessboard {
  size
  grids

  constructor(size = 4) {
    this.size = size
    const grids = this.grids = Utils.createGrids(size, null)
    let new2 = Utils.randomEmptyPosition(grids)
    grids[new2[0]][new2[1]] = 2
    new2 = Utils.randomEmptyPosition(grids)
    grids[new2[0]][new2[1]] = 2
  }

  * traversal(direction) {
    switch (direction) {
      case 'up': {
        for (let j = 0; j < this.size; j++) {
          for (let i = 0; i < this.size; i++) {
            yield [i, j]
          }
        }
      }
        break;
      case 'right': {
        for (let i = 0; i < this.size; i++) {
          for (let j = this.size - 1; j >= 0; j--) {
            yield [i, j]
          }
        }
      }
        break;
      case 'down': {
        for (let j = 0; j < this.size; j++) {
          for (let i = this.size - 1; i >= 0; i--) {
            yield [i, j]
          }
        }
      }
        break;
      case null:
      case 'left': {
        for (let i = 0; i < this.size; i++) {
          for (let j = 0; j < this.size; j++) {
            yield [i, j]
          }
        }
      }
        break;
    }
    return;
  }

  isLegal(i, j) {
    return i >= 0 && i < this.size && j >= 0 && j < this.size;
  }

  move(direction) {
    const changes = []
    const posGen = this.traversal(direction)
    const offsets = {
      up: [-1, 0],
      right: [0, 1],
      down: [1, 0],
      left: [0, -1],
    }
    const offset = offsets[direction]
    const grids = Utils.copyGrids(this.grids)
    const flagGrids = Utils.createGrids(this.size, false)
    for (let p of posGen) {
      const nowValue = grids[p[0]][p[1]]
      if (null === nowValue)
        continue
      let aP = p
      let to = [p[0] + offset[0], p[1] + offset[1]]
      while (true) {
        if (!this.isLegal(to[0], to[1]))
          break;
        // 在棋盘内
        const toValue = grids[to[0]][to[1]]
        if (null === toValue) {
          aP = to
          to = [to[0] + offset[0], to[1] + offset[1]]
          continue
        }
        // 要去的地方有值
        if (nowValue === toValue && (!flagGrids[to[0]][to[1]])) {
          aP = to
        }
        //要去的地方有不相等的值或有相等但已经合并过的值
        break;
      }
      if (aP === p) {
        //do nothing，因为位置没变
      } else {
        let change = {}
        if (null === grids[aP[0]][aP[1]]) {
          grids[aP[0]][aP[1]] = nowValue
          change.type = 'move'

        } else {
          grids[aP[0]][aP[1]] = nowValue * 2
          flagGrids[aP[0]][aP[1]] = true
          change.type = 'mix'
        }
        change.from = p
        change.to = aP
        grids[p[0]][p[1]] = null
        changes.push(change)
      }
    }
    const new2 = Utils.randomEmptyPosition(grids)
    grids[new2[0]][new2[1]] = 2
    let change = {}
    change.type = 'new'
    change.position = new2
    change.value = 2
    changes.push(change)
    this.grids = grids
    this.print()
    display.receive(changes)
    return;
  }

  print() {
    console.log('网格：')
    for (let i = 0; i < this.size; i++) {
      console.log(this.grids[i])
    }
  }


}

const gridContainer = document.getElementsByClassName('grid-container')[0];

class Display {
  chessboard
  elementGrids

  constructor(chessboard) {
    this.chessboard = chessboard
    this.elementGrids = Utils.createGrids(chessboard.size, null)
    this.init()
  }

  init() {
    const size = this.chessboard.size
    const grids = this.chessboard.grids
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (null !== grids[i][j]) {
          const element = document.createElement('div')
          element.appendChild(document.createTextNode(String(grids[i][j])))
          element.classList.add('hover-grid')
          element.style.top = i * (106.25 + 15) + 'px'
          element.style.left = j * (106.25 + 15) + 'px'
          gridContainer.appendChild(element)
          this.elementGrids[i][j] = element
        }
      }
    }
  }

  getStylePosition(position) {
    const [i, j] = position
    return {top: i * (106.25 + 15), left: j * (106.25 + 15)}
  }

  receive(changes) {
    const moves = changes.filter(value => 'move' === value.type || 'mix' === value.type)
    const mixes = changes.filter(value => 'mix' === value.type)
    const news = changes.filter(value => 'new' === value.type)
    new Promise((resolve, reject) => {
      const startTime = Date.now()
      let id = null;
      const callback = () => {
        const passed = Date.now() - startTime
        const nowTime = Date.now()
        if (passed < moveTime * 1000) {
          const ratio = passed / (moveTime * 1000)
          for (let change of moves) {
            const from = change.from
            const fromPosition = this.getStylePosition(from)
            const to = change.to
            const toPosition = this.getStylePosition(to)
            const element = this.elementGrids[from[0]][from[1]]
            element.style.top = (fromPosition.top + (toPosition.top - fromPosition.top) * ratio) + 'px'
            element.style.left = (fromPosition.left + (toPosition.left - fromPosition.left) * ratio) + 'px'
          }
          window.requestAnimationFrame(callback)
        } else {
          for (let change of moves) {
            const from = change.from
            const to = change.to
            const toPosition = this.getStylePosition(to)
            const element = this.elementGrids[from[0]][from[1]]
            element.style.top = toPosition.top + 'px'
            element.style.left = toPosition.left + 'px'

            if ('mix' === change.type) {
              gridContainer.removeChild(this.elementGrids[to[0]][to[1]])
            }
            this.elementGrids[to[0]][to[1]] = element
            this.elementGrids[from[0]][from[1]] = null
          }
          window.cancelAnimationFrame(id)
          resolve()
        }
      }
      callback()
    }).then(() => {
      for (let change of mixes) {
        const from = change.from
        const to = change.to
        const toPosition = this.getStylePosition(to)
        gridContainer.removeChild(this.elementGrids[to[0]][to[1]])
        const element = document.createElement('div')
        element.appendChild(document.createTextNode(String(this.chessboard.grids[to[0]][to[1]])))
        element.classList.add('hover-grid')
        element.style.top = toPosition.top + 'px'
        element.style.left = toPosition.left + 'px'
        gridContainer.appendChild(element)
        this.elementGrids[to[0]][to[1]] = element
      }
      for (let change of news) {
        const p = change.position
        const toPosition = this.getStylePosition(p)
        const element = document.createElement('div')
        element.appendChild(document.createTextNode(String(this.chessboard.grids[p[0]][p[1]])))
        element.classList.add('hover-grid')
        element.style.top = toPosition.top + 'px'
        element.style.left = toPosition.left + 'px'
        element.style.transform = 'scale(0,0)'
        gridContainer.appendChild(element)
        this.elementGrids[p[0]][p[1]] = element
      }

      const startTime = Date.now()
      let id = null;
      const callback = () => {
        const passed = Date.now() - startTime
        const ratio = Math.min(passed / (newTime * 1000), 1)
        for (let change of mixes) {
          const p = change.to
          const element = this.elementGrids[p[0]][p[1]]
          const scale=1+(0.5-Math.abs(ratio-0.5))*0.25
          element.style.transform = 'scale(' + scale + ',' + scale + ')'
        }
        for (let change of news) {
          const p = change.position
          const element = this.elementGrids[p[0]][p[1]]
          element.style.transform = 'scale(' + ratio + ',' + ratio + ')'
        }
        if (passed < newTime * 1000) {
          id=window.requestAnimationFrame(callback)
        }else{
          window.cancelAnimationFrame(id)
        }
      }
      callback()
    })
  }
}

let chessboard = new Chessboard();
let display = new Display(chessboard)
chessboard.print()

//为键盘方向键增加监听事件
document.body.addEventListener('keyup', e => {
  e.preventDefault()
  const result = e.code.match(/Arrow(Up|Right|Down|Left)/)
  if (null === result)
    return;
  const direction = result[1].toLowerCase()
  chessboard.move(direction)
}, false)
