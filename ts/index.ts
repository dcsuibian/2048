// console.log('欢迎来到dcsuibian的练手2048项目，侵删')
//
// interface Position {
//     row: number,
//     col: number,
// }
//
// enum Direction {
//     up,
//     right,
//     down,
//     left,
// }
//
// class Utils {
//     static createGrids<T>(size: number, value: T): Array<Array<T>> {
//         const grids = []
//         for (let i = 0; i < size; i++) {
//             const row = []
//             for (let j = 0; j < size; j++) {
//                 row.push(value)
//             }
//             grids.push(row)
//         }
//         return grids
//     }
//
//     * generator(count: number): IterableIterator<number> {
//         while (true)
//             yield count++;
//     }
//
//     static* traversal(direction: Direction | null, size: number): IterableIterator<Position> {
//         switch (direction) {
//             case Direction.up: {
//                 for (let j = 0; j < size; j++) {
//                     for (let i = 0; i < size; i++) {
//                         yield {row: i, col: j}
//                     }
//                 }
//             }
//                 break;
//             case Direction.right: {
//                 for (let i = 0; i < size; i++) {
//                     for (let j = size - 1; j >= 0; j--) {
//                         yield {row: i, col: j}
//                     }
//                 }
//             }
//                 break;
//             case Direction.down: {
//                 for (let j = 0; j < size; j++) {
//                     for (let i = size - 1; i >= 0; i--) {
//                         yield {row: i, col: j}
//                     }
//                 }
//             }
//                 break;
//             case null:
//             case Direction.left: {
//                 for (let i = 0; i < size; i++) {
//                     for (let j = 0; j < size; j++) {
//                         yield {row: i, col: j}
//                     }
//                 }
//             }
//                 break;
//         }
//     }
// }
//
// class Chessboard {
//     private readonly size: number;
//     private grids: Array<Array<number | null>>;
//
//     constructor(size: number = 4) {
//         this.size = size
//         this.grids = Utils.createGrids(size, null)
//     }
//     private isLegalPosition(p:Position){
//         return p.row>=0&&p.col>=0&&p.row<this.size&&p.col<this.size
//     }
//     private move(direction: Direction) {
//         const posGen = Utils.traversal(direction, this.size)
//         const offsets = [
//             [-1, 0],
//             [0, 1],
//             [1, 0],
//             [0, -1],
//         ]
//         const offset = offsets[direction]
//         const grids=this.grids
//         for(let p of posGen){
//             if
//         }
//     }
//
//     up() {
//         console.log('↑')
//         this.move(Direction.up)
//     }
//
//     right() {
//         console.log('→')
//         this.move(Direction.right)
//     }
//
//     down() {
//         console.log('↓')
//         this.move(Direction.down)
//     }
//
//     left() {
//         console.log('←')
//         this.move(Direction.left)
//     }
// }
//
// const chessboard: Chessboard = new Chessboard();
//
// //为键盘方向键增加监听事件
// document.body.addEventListener('keyup', e => {
//     switch (e.code) {
//         case 'ArrowUp':
//             chessboard.up();
//             break;
//         case 'ArrowRight':
//             chessboard.right();
//             break;
//         case 'ArrowDown':
//             chessboard.down();
//             break;
//         case 'ArrowLeft':
//             chessboard.left();
//             break;
//     }
//     e.preventDefault()
// }, false)
