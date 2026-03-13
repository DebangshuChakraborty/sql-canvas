import React, { useState } from 'react';

export default function ConnectionForm({ onConnect }) {
  const [formData, setFormData] = useState({
    host: 'localhost',
    port: '1522',
    username: 'user_db',
    password: '',
    serviceName: 'XEPDB1',
    useThickMode: false,
    clientPath: ''
  });

  const [isStarting, setIsStarting] = useState(false);
  const [dockerMessage, setDockerMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleStartLocal = async () => {
    setIsStarting(true);
    setDockerMessage('Initializing... this might take a few moments to pull the image the first time.');

    try {
      if (window.electronAPI && window.electronAPI.startLocalDB) {
        const result = await window.electronAPI.startLocalDB();
        if (result.success) {
          setDockerMessage('Docker container started successfully! Auto-filling connection details...');

          // Auto fill fields for local docker compose default setup
          const dockerConfig = {
            ...formData,
            host: 'localhost',
            port: '1522',
            username: 'user_db',
            password: 'user_db',
            serviceName: 'XEPDB1',
            useThickMode: false
          };

          setFormData(dockerConfig);

          // Optional: Auto-connect after 2 seconds to let the DB fully boot up
          setTimeout(() => {
            setDockerMessage('Docker DB is running ✅');
            onConnect(dockerConfig);
          }, 2000);

        } else {
          setDockerMessage(`Failed to start container: ${result.error}`);
        }
      } else {
        setDockerMessage('Error: App is not running in Electron mode.');
      }
    } catch (err) {
      setDockerMessage(`Error: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    backgroundColor: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color-bright)',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ width: '400px', backgroundColor: 'var(--bg-color-light)', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: 'var(--text-color-bright)' }}>Connect to Oracle DB</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Host</label>
          <input name="host" value={formData.host} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Port</label>
          <input name="port" value={formData.port} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Service Name</label>
          <input name="serviceName" value={formData.serviceName} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Username</label>
          <input name="username" value={formData.username} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '13px', color: 'var(--text-color)', cursor: 'pointer' }}>
            <input type="checkbox" name="useThickMode" checked={formData.useThickMode} onChange={handleChange} style={{ marginRight: '8px' }} />
            Use Thick Mode (Required for Oracle 11g or older)
          </label>
        </div>
        {formData.useThickMode && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-color)' }}>Oracle Instant Client Path (Optional)</label>
            <input name="clientPath" value={formData.clientPath} onChange={handleChange} style={inputStyle} placeholder="e.g. C:\oracle\instantclient_23_3" />
            <div style={{ fontSize: '11px', color: 'var(--bg-color-lighter)', marginTop: '-10px' }}>
              Leave blank if Instant Client is in your system PATH.
            </div>
          </div>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--accent-color)', color: 'var(--text-color-bright)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>
          Connect to DB
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--bg-color-lighter)', margin: '0 0 10px 0' }}>Don't have a database running?</p>
        <button
          onClick={handleStartLocal}
          disabled={isStarting}
          style={{ width: '100%', padding: '10px', backgroundColor: isStarting ? 'var(--border-color)' : '#008e5aff', color: 'var(--text-color-bright)', border: 'none', borderRadius: '4px', cursor: isStarting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isStarting ? 'Starting Container...' : 'Quick Start Local DB (Docker)'}
        </button>
        {dockerMessage && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: dockerMessage.includes('Error') || dockerMessage.includes('Failed') ? '#dc322f' : '#859900', textAlign: 'left', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {dockerMessage}
          </div>
        )}
      </div>
    </div>
  );
}
