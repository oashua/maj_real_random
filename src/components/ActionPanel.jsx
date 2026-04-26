export default function ActionPanel({ actions, onAction }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div style={{
      position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '12px',
      display: 'flex', gap: '8px', zIndex: 10,
    }}>
      {actions.map((action, i) => (
        <button key={i} className={`action-btn action-${action.type}`}
          style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          onClick={() => onAction(action)}>
          {actionLabel(action)}
        </button>
      ))}
      <button className="action-btn action-skip"
        style={{ padding: '8px 16px', border: '1px solid #999', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', background: 'transparent', color: '#f5f0e0' }}
        onClick={() => onAction({ type: 'skip' })}>
        跳过
      </button>
    </div>
  );
}

function actionLabel(action) {
  const labels = { 'ron': '和', 'tsumo': '自摸', 'pon': '碰', 'chi': '吃', 'minkan': '明杠', 'ankan': '暗杠', 'kakan': '加杠', 'riichi': '立直' };
  return labels[action.type] || action.type;
}