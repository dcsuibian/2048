'use strict';
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
    const changes=[]
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
        let change={}
        if (null === grids[aP[0]][aP[1]]) {
          grids[aP[0]][aP[1]] = nowValue
          change.type='move'

        } else {
          grids[aP[0]][aP[1]] = nowValue * 2
          flagGrids[aP[0]][aP[1]] = true
          change.type='mix'
        }
        change.from=p
        change.to=aP
        grids[p[0]][p[1]] = null

      }
    }
    const new2 = Utils.randomEmptyPosition(grids)
    grids[new2[0]][new2[1]] = 2
    let change={}
    change.type='new'
    changes.position=new2
    change.value=2
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
class Display{
  chessboard
  elementGrids
  constructor(chessboard) {
    this.chessboard=chessboard
    this.elementGrids=Utils.createGrids(chessboard.size,null)
    this.init()
  }
  init(){
    const size=this.chessboard.size
    const grids=this.chessboard.grids
    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        if(null!==grids[i][j]){
          const element=document.createElement('div')
          element.appendChild(document.createTextNode(String(grids[i][j])))
          element.classList.add('hover-grid')
          element.style.top=i*(106.25+15)+'px'
          element.style.left=j*(106.25+15)+'px'
          gridContainer.appendChild(element)
          this.elementGrids[i][j]=element
        }
      }
    }
  }
  receive(changes){
    new Promise((resolve, reject) => {
      window.requestAnimationFrame(()=>{

      })
    }).then((id)=>{
      window.cancelAnimationFrame(id)
    })
  }
}

let chessboard = new Chessboard();
let display=new Display(chessboard)
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
