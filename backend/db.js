const oracledb = require('oracledb');

// Configure oracledb to fetch as objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let currentConnection = null;

async function connect(config) {
  if (currentConnection) {
    await disconnect();
  }

  const { host, port, username, password, serviceName, useThickMode, clientPath } = config;

  if (useThickMode) {
    try {
      if (oracledb.thin) {
        if (clientPath && clientPath.trim() !== '') {
          oracledb.initOracleClient({ libDir: clientPath });
        } else {
          oracledb.initOracleClient();
        }
      }
    } catch (err) {
      console.error('Error initializing Thick mode:', err);
      // Ignore if already initialized
      if (!err.message.includes('already initialized') && !err.message.includes('NJS-072')) {
        throw new Error('Failed to initialize Thick mode. Ensure Instant Client is installed. Details: ' + err.message);
      }
    }
  }

  const connectString = `${host}:${port}/${serviceName}`;

  try {
    currentConnection = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connectString
    });
    return true;
  } catch (err) {
    console.error('Connection error:', err);
    throw err;
  }
}

async function disconnect() {
  if (currentConnection) {
    try {
      // Perform a COMMIT before disconnecting, per user request
      try {
        await currentConnection.execute('COMMIT');
        console.log('Successfully committed transactions before disconnecting.');
      } catch (commitErr) {
        console.error('Error committing before disconnect:', commitErr);
      }

      await currentConnection.close();
      currentConnection = null;
    } catch (err) {
      console.error('Error closing connection:', err);
      throw err;
    }
  }
}

async function runQuery(query) {
  if (!currentConnection) {
    throw new Error('Not connected to database');
  }

  // Strip trailing whitespace and semicolons, as node-oracledb does not support them for a single execute statement
  const cleanedQuery = query.replace(/;\s*$/, '');

  try {
    const result = await currentConnection.execute(cleanedQuery);

    // Convert metaData to a plain JS object array so Electron IPC can clone it
    const safeMetaData = result.metaData ? result.metaData.map(meta => ({ name: meta.name })) : [];

    // Rows may contain Oracle date objects or getters that cannot be cloned by Electron IPC
    // The safest way to pass them across is to serialize to string and back to a simple deep-cloned JSON object
    // Also, note that DML statements (INSERT, UPDATE) will not return rows.
    const safeRows = result.rows ? JSON.parse(JSON.stringify(result.rows)) : [];

    return {
      rows: safeRows,
      metaData: safeMetaData
    };
  } catch (err) {
    console.error('Query execution error:', err);
    throw err;
  }
}

async function getSchemaInfo() {
  if (!currentConnection) {
    throw new Error('Not connected to database');
  }

  try {
    // Basic query to get user tables and their columns
    const tablesQuery = `
      SELECT table_name 
      FROM user_tables
      ORDER BY table_name
    `;
    const tablesResult = await currentConnection.execute(tablesQuery);

    const viewsQuery = `
      SELECT view_name
      FROM user_views
      ORDER BY view_name
    `;
    const viewsResult = await currentConnection.execute(viewsQuery);

    const columnsQuery = `
      SELECT table_name, column_name, data_type
      FROM user_tab_columns
      ORDER BY table_name, column_id
    `;
    const columnsResult = await currentConnection.execute(columnsQuery);

    // Same IPC serialization safety measure as runQuery
    return JSON.parse(JSON.stringify({
      tables: tablesResult.rows,
      views: viewsResult.rows,
      columns: columnsResult.rows
    }));
  } catch (err) {
    console.error('Error fetching schema info:', err);
    throw err;
  }
}

const { exec } = require('child_process');
const path = require('path');

async function startLocalDatabase() {
  return new Promise((resolve, reject) => {
    // Navigate two directories up from backend/db.js to find the docker-compose.yml
    const projectRoot = path.join(__dirname, '..');

    exec('docker-compose up -d', { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        console.error(`docker-compose error: ${error.message}`);
        // If docker is not recognized, it usually means it's not installed or not in PATH
        if (error.message.includes('not recognized') || error.message.includes('ENOENT')) {
          reject(new Error('Docker is not installed or not running. Please install Docker Desktop and try again.'));
        } else {
          reject(new Error(`Failed to start local database: ${stderr || error.message}`));
        }
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

module.exports = {
  connect,
  disconnect,
  runQuery,
  getSchemaInfo,
  startLocalDatabase
};
