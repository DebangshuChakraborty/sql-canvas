import React from 'react';
import { Database, Table, Columns, FileCode } from 'lucide-react';

export default function Sidebar({ isConnected, schemaInfo, onDisconnect, onTableClick }) {
  return (
    <div style={{ width: '250px', backgroundColor: 'var(--bg-color-light)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <Database size={18} color="var(--text-color)" />
          <span style={{ color: 'var(--text-color)' }}>Explorer</span>
        </div>
        {isConnected && (
          <button onClick={onDisconnect} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>
            Disconnect
          </button>
        )}
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {!isConnected ? (
          <div style={{ color: 'var(--bg-color-lighter)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
            Not connected
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--bg-color-lighter)', marginBottom: '8px', padding: '0 5px' }}>Tables</div>
              {schemaInfo.tables && schemaInfo.tables.map(t => (
                <div 
                  key={t.TABLE_NAME} 
                  onClick={() => onTableClick(t.TABLE_NAME)}
                  style={{ 
                    fontSize: '13px', padding: '6px 5px', display: 'flex', alignItems: 'center', gap: '8px', 
                    color: 'var(--text-color)', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-lighter)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Table size={14} color="var(--accent-color)" />
                  {t.TABLE_NAME}
                </div>
              ))}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--bg-color-lighter)', marginBottom: '8px', marginTop: '15px', padding: '0 5px' }}>Views</div>
              {schemaInfo.views && schemaInfo.views.map(v => (
                <div 
                  key={v.VIEW_NAME} 
                  onClick={() => onTableClick(v.VIEW_NAME)}
                  style={{ 
                    fontSize: '13px', padding: '6px 5px', display: 'flex', alignItems: 'center', gap: '8px', 
                    color: 'var(--text-color)', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-lighter)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileCode size={14} color="var(--accent-color)" />
                  {v.VIEW_NAME}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
