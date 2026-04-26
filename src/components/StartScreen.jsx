import { useState } from 'react';

export default function StartScreen({ onStart }) {
  const [seed, setSeed] = useState(Date.now());

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#1a5c2a', color: '#f5f0e0',
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>日本麻将</h1>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '14px' }}>随机种子:</label>
        <input type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value) || 0)}
          style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '14px', width: '160px', background: '#2a4c3a', border: '1px solid #5a8c6a', color: '#f5f0e0', borderRadius: '4px' }} />
        <button onClick={() => setSeed(Date.now())}
          style={{ marginLeft: '8px', padding: '4px 12px', background: '#3a6c4a', border: '1px solid #5a8c6a', color: '#f5f0e0', borderRadius: '4px', cursor: 'pointer' }}>
          刷新
        </button>
      </div>
      <button onClick={() => onStart(seed)}
        style={{ padding: '12px 32px', fontSize: '18px', background: '#e74c3c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
        开始游戏
      </button>
    </div>
  );
}