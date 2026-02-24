import "../styles/ExcelImport.css";

/**
 * Reusable component that renders Excel data as a table (desktop) and cards (mobile).
 * Handles "תמונה" column for base64 image display.
 */
function ExcelDataTable({ data, title = "נתונים", countLabel = "שורות" }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]).filter((key) => key !== "_images");

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>{title}</h2>
        <span className="results-count">
          {data.length} {countLabel}
        </span>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => {
                  const cell = row[header];
                  return (
                    <td key={cellIndex}>
                      {header === "תמונה" ? (
                        cell ? (
                          <div className="table-images">
                            <img
                              src={`data:image/jpeg;base64,${cell}`}
                              className="table-image"
                              alt="תמונה"
                            />
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-subtle)" }}>--</span>
                        )
                      ) : (
                        cell ?? "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-mobile-view">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="table-card">
            {headers.map((header, index) => {
              const value = row[header];
              return (
                <div key={index} className="table-card-row">
                  <div className="table-card-label">{header}</div>
                  <div className="table-card-value">
                    {header === "תמונה" ? (
                      value ? (
                        <img
                          src={`data:image/jpeg;base64,${value}`}
                          alt="תמונה"
                          className="table-image-mobile"
                        />
                      ) : (
                        <span style={{ color: "var(--text-subtle)" }}>--</span>
                      )
                    ) : (
                      value ?? "-"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExcelDataTable;
