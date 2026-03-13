import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Eraser, Info, X } from 'lucide-react';

export default function SqlEditor({ onRunQuery, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || 'SELECT * FROM user_tables');
  const [showAbout, setShowAbout] = useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleEditorChange = (value) => {
    setQuery(value);
  };

  const handleRun = () => {
    if (!query) return;

    // Optional: Get selected text if any, otherwise use full text
    // We don't have a direct ref to the monaco instance here yet, 
    // so we'll just send the full text for now.
    
    // Before we send it, strip out trailing semicolons and comments at the end
    // that might cause Oracle ORA-00911 or ORA-00933 errors.
    let cleanQuery = query
      .split('\n')
      .map(line => line.trimEnd())
      .filter(line => line.length > 0 && !line.startsWith('--'))
      .join('\n')
      .trim();

    // Strip trailing semicolon
    if (cleanQuery.endsWith(';')) {
      cleanQuery = cleanQuery.slice(0, -1);
    }
    
    if (cleanQuery) {
      onRunQuery(cleanQuery);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('bearded-arc-blueberry', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '111422' },
        { token: 'keyword', foreground: 'EACD61' },
        { token: 'string', foreground: '3CEC85' },
        { token: 'number', foreground: 'FF955C' },
        { token: 'identifier', foreground: '69C3FF' },
        { token: 'comment', foreground: '3c4776', fontStyle: 'italic' }
      ],
      colors: {
        'editor.background': '#111422',
        'editor.foreground': '#bcc1dc',
        'editorLineNumber.foreground': '#33374e',
        'editor.selectionBackground': '#8eb0e64d',
        'editor.inactiveSelectionBackground': '#8eb0e64d'
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 15px', backgroundColor: 'var(--bg-color-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleRun}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '5px', 
              backgroundColor: 'var(--accent-color)', color: 'var(--text-color-bright)', border: 'none', 
              padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 'bold'
            }}
          >
            <Play size={14} />
            Run Query
          </button>
          <button 
            onClick={handleClear}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '5px', 
              backgroundColor: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border-color)', 
              padding: '5px 11px', borderRadius: '4px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 'bold', transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-lighter)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Eraser size={14} />
            Clear Query
          </button>
        </div>
        <button 
          onClick={() => setShowAbout(true)}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border-color)', 
            width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.2s',
            fontFamily: 'monospace'
          }}
          title="About"
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-color-lighter)'; e.currentTarget.style.color = 'var(--text-color-bright)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; }}
        >
          i
        </button>
      </div>

      {showAbout && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '20px',
            width: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            color: 'var(--text-color)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAbout(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-color)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-color-bright)' }}>About</h2>
            <p><strong>App Name:</strong> SQL Canvas</p>
            <p style={{ marginBottom: 0 }}><strong>Developer:</strong> Debangshu chakraborty</p>
          </div>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="bearded-arc-blueberry"
          value={query}
          beforeMount={handleEditorWillMount}
          onChange={(value) => handleEditorChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}
