import { Z_TILE_NAMES, M_RANK_NAMES } from '../core/tiles';
import '../styles/tiles.css';

const SUIT_CLASSES = { m: 'tile-man', p: 'tile-pin', s: 'tile-sou', z: 'tile-z' };
const Z_SUB_CLASSES = { 1: 'tile-z-east', 2: 'tile-z-south', 3: 'tile-z-west', 4: 'tile-z-north', 5: 'tile-z-haku', 6: 'tile-z-hatsu', 7: 'tile-z-chun' };

export default function Tile({ tile, interactive = false, selected = false, sideways = false, small = false, onClick }) {
  if (!tile) return null;

  const classes = [
    'tile',
    SUIT_CLASSES[tile.suit],
    tile.suit === 'z' ? Z_SUB_CLASSES[tile.rank] : '',
    interactive ? 'interactive' : '',
    selected ? 'selected' : '',
    sideways ? 'sideways' : '',
    small ? 'small' : '',
    tile.aka ? 'aka' : '',
  ].filter(Boolean).join(' ');

  const handleClick = interactive ? () => onClick?.(tile) : undefined;

  return (
    <div className={classes} onClick={handleClick}>
      {renderTileContent(tile)}
    </div>
  );
}

function renderTileContent(tile) {
  if (tile.suit === 'm') {
    return (
      <>
        <span className="tile-rank">{M_RANK_NAMES[tile.rank]}</span>
        <span className="tile-suit-label">萬</span>
      </>
    );
  }
  if (tile.suit === 'p') return <PinDots rank={tile.rank} aka={tile.aka} />;
  if (tile.suit === 's') return <SouBamboo rank={tile.rank} aka={tile.aka} />;
  if (tile.suit === 'z') return <span className="tile-char">{Z_TILE_NAMES[tile.rank]}</span>;
  return null;
}

const PIN_LAYOUTS = {
  1: [[1]], 2: [[1],[1]], 3: [[1],[1],[1]],
  4: [[1,1],[1,1]], 5: [[1,1],[1],[1,1]],
  6: [[1,1],[1,1],[1,1]], 7: [[1,1,1],[1],[1,1,1]],
  8: [[1,1,1],[1,1],[1,1,1]], 9: [[1,1,1],[1,1,1],[1,1,1]],
};

function PinDots({ rank, aka }) {
  const layout = PIN_LAYOUTS[rank] || [];
  return (
    <div className="dots">
      {layout.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: '2px' }}>
          {row.map((dot, di) => (
            <div key={di} className={`dot ${aka && rank === 5 ? 'red' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function SouBamboo({ rank, aka }) {
  const lines = rank;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
      {Array.from({ length: Math.min(lines, 3) }, (_, i) => (
        <span key={i} className={`bamboo ${aka && rank === 5 ? 'red' : ''}`}>
          🀄
        </span>
      ))}
      {lines > 3 && (
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: lines - 3 }, (_, i) => (
            <span key={i} className={`bamboo ${aka && rank === 5 ? 'red' : ''}`} style={{ fontSize: '10px' }}>
              🀄
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TileBack({ sideways = false, small = false }) {
  const classes = ['tile-back', sideways ? 'sideways' : '', small ? 'small' : ''].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      <div className="pattern" />
    </div>
  );
}