export default function ResultScreen({ result, onContinue }) {
  if (!result) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
    }}>
      <div style={{ background: '#2a4c3a', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#f5f0e0', minWidth: '300px' }}>
        {result.type === 'ron' && (
          <>
            <h2 style={{ fontSize: '24px', color: '#e74c3c' }}>荣和!</h2>
            <p>{result.winner} 和牌</p>
            <p>放铳: {result.loser}</p>
          </>
        )}
        {result.type === 'tsumo' && (
          <>
            <h2 style={{ fontSize: '24px', color: '#e74c3c' }}>自摸!</h2>
            <p>{result.winner} 自摸和牌</p>
          </>
        )}
        {result.type === 'ryuukyoku' && (
          <>
            <h2 style={{ fontSize: '24px', color: '#f39c12' }}>流局</h2>
            {result.tenpaiPlayers && <p>听牌: {result.tenpaiPlayers.join(', ')}</p>}
          </>
        )}
        {result.yaku && (
          <div style={{ margin: '12px 0' }}>
            <p style={{ fontWeight: 'bold' }}>役:</p>
            {result.yaku.map((y, i) => <p key={i}>{y.name} ({y.han}番)</p>)}
            <p style={{ fontWeight: 'bold', marginTop: '8px' }}>{result.totalHan}番 {result.fu}符</p>
          </div>
        )}
        {result.pointsChange && (
          <div style={{ margin: '8px 0' }}>
            {Object.entries(result.pointsChange).map(([name, change]) => (
              <p key={name}>{name}: {change > 0 ? `+${change}` : change}点</p>
            ))}
          </div>
        )}
        <button onClick={onContinue}
          style={{ marginTop: '16px', padding: '8px 24px', fontSize: '16px', background: '#3a6c4a', border: '1px solid #5a8c6a', borderRadius: '8px', color: '#f5f0e0', cursor: 'pointer' }}>
          继续
        </button>
      </div>
    </div>
  );
}