import React from "react";

export default function ResultsTable({ results, error }) {
  if (error) {
    return (
      <div style={{ padding: 15, color: "#dc322f", background: "var(--bg-color)" }}>
        <h3>Error Executing Query</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!results) {
    return (
      <div style={{ padding: 20, color: "var(--bg-color-lighter)" }}>
        Run a query to see results here
      </div>
    );
  }

  if (!results.rows || results.rows.length === 0) {
    return (
      <div style={{ padding: 20, color: "var(--bg-color-lighter)" }}>
        Query executed successfully. No rows returned.
      </div>
    );
  }

  const headers = results.metaData
    ? results.metaData.map((m) => m.name)
    : Object.keys(results.rows[0] || {});

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        background: "var(--bg-color)"
      }}
    >
      <div
        style={{
          padding: "8px 15px",
          background: "var(--bg-color-light)",
          color: "var(--text-color)",
          fontSize: 12,
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        Results: {results.rows.length} row(s)
      </div>

      {/* Scroll container */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "auto"
        }}
      >
        {/* Width wrapper */}
        <div style={{ display: "block", width: "max-content" }}>
          <table
            style={{
               borderCollapse: "collapse",
              fontSize: 13,
              color: "var(--text-color)"
            }}
          >
            <thead style={{ background: "var(--bg-color-light)" }}>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "8px 12px",
                      borderRight: "1px solid var(--border-color)",
                      borderBottom: "1px solid var(--border-color)",
                      textAlign: "left",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {results.rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? "var(--bg-color)" : "var(--bg-color-light)"
                  }}
                >
                  {headers.map((h, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "6px 12px",
                        borderRight: "1px solid var(--border-color)",
                        borderBottom: "1px solid var(--border-color)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {row[h] ?? (
                        <span style={{ color: "var(--bg-color-lighter)", fontStyle: "italic" }}>
                          null
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}