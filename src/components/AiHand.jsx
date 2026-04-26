import { TileBack } from './Tile';
import Tile from './Tile';

export default function AiHand({ hand, showTiles = false, sideways = false }) {
  if (!hand) return null;

  const tileCount = hand.tiles.length + (hand.drawnTile ? 1 : 0);

  return (
    <div className={`player-hand ${sideways ? 'sideways' : ''}`}>
      {showTiles
        ? hand.tiles.map(tile => <Tile key={tile.id} tile={tile} sideways={sideways} />)
        : Array.from({ length: tileCount }, (_, i) => <TileBack key={i} sideways={sideways} />)
      }
      {hand.calls.length > 0 && (
        <div className="calls-area">
          {hand.calls.map((call, ci) => (
            <div key={ci} className="call-group">
              {call.tiles && call.tiles.map(t => <Tile key={t.id} tile={t} small sideways={sideways} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}