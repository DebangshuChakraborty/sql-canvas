import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ConnectionForm from './components/ConnectionForm';
import SqlEditor from './components/SqlEditor';
import ResultsTable from './components/ResultsTable';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState(null);
  const [schemaInfo, setSchemaInfo] = useState({ tables: [], views: [], columns: [] });
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleConnect = async (config) => {
    try {
      const response = await window.electronAPI.connectDB(config);
      if (response.success) {
        setIsConnected(true);
        setConnectionConfig(config);
        fetchSchemaInfo();
      } else {
        alert('Connection failed: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDisconnect = async () => {
    await window.electronAPI.disconnectDB();
    setIsConnected(false);
    setConnectionConfig(null);
    setSchemaInfo({ tables: [], views: [], columns: [] });
    setQueryResults(null);
  };

  const fetchSchemaInfo = async () => {
    try {
      const response = await window.electronAPI.getSchemaInfo();
      if (response.success) {
        setSchemaInfo(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch schema info', err);
    }
  };

  const handleRunQuery = async (query) => {
    setQueryError(null);
    setQueryResults(null);
    try {
      const response = await window.electronAPI.runQuery(query);
      if (response.success) {
        setQueryResults(response.data);
        
        // Auto-refresh schema if the query likely modified tables or views
        const upperQuery = query.toUpperCase().trim();
        if (
          upperQuery.startsWith('CREATE TABLE') || 
          upperQuery.startsWith('DROP TABLE') || 
          upperQuery.startsWith('ALTER TABLE') ||
          upperQuery.startsWith('CREATE VIEW') ||
          upperQuery.startsWith('CREATE OR REPLACE VIEW') ||
          upperQuery.startsWith('DROP VIEW')
        ) {
          fetchSchemaInfo();
        }
      } else {
        setQueryError(response.error);
      }
    } catch (err) {
      setQueryError(err.message);
    }
  };

  const [activeQuery, setActiveQuery] = useState('SELECT * FROM user_tables');

  const handleTableClick = (tableName) => {
    const newQuery = `SELECT * FROM ${tableName}`;
    setActiveQuery(newQuery);
    handleRunQuery(newQuery);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar 
        isConnected={isConnected} 
        schemaInfo={schemaInfo} 
        onDisconnect={handleDisconnect} 
        onTableClick={handleTableClick}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, backgroundColor: 'var(--bg-color)' }}>
        {!isConnected ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <ConnectionForm onConnect={handleConnect} />
          </div>
        ) : (
          <>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)', height: '60%', display: 'flex', flexDirection: 'column' }}>
              <SqlEditor onRunQuery={handleRunQuery} initialQuery={activeQuery} />
            </div>
            <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-color)', height: '40%' }}>
              <ResultsTable results={queryResults} error={queryError} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
