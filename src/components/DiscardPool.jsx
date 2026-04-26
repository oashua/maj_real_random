import Tile from './Tile';

export default function DiscardPool({ discards, sideways = false }) {
  return (
    <div className={`discards-area ${sideways ? 'sideways' : ''}`}>
      {discards.map(tile => <Tile key={tile.id} tile={tile} small />)}
    </div>
  );
}