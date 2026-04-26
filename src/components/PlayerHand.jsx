import Tile from './Tile';

export default function PlayerHand({ hand, onDiscard, riichi }) {
  if (!hand) return null;

  return (
    <div className="player-hand">
      {hand.tiles.map(tile => (
        <Tile key={tile.id} tile={tile} interactive={!riichi} onClick={onDiscard} />
      ))}
      {hand.drawnTile && (
        <div style={{ marginLeft: '8px' }}>
          <Tile key={hand.drawnTile.id} tile={hand.drawnTile} interactive={true} onClick={onDiscard} />
        </div>
      )}
    </div>
  );
}