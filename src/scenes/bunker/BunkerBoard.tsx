import { copy } from '../../data/content'
export default function BunkerBoard() {
  return <div className="bunker-object bunker-board" data-object="board">
    <img src="/s03/board/case-board.webp" alt={""} decoding="sync" />
    <span className="bunker-board-evidence">{copy("CASE 03 / THE HUNT")}</span>
  </div>
}
