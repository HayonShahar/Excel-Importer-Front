import { useState } from "react";
import "../styles/Home.css";

function Home({ email, onLogout, onUpload }) {
  const [file, setFile] = useState(null);
  const [column, setColumn] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filteredData, setFilteredData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !column || !value) {
      setMessage({ type: "error", text: "נא למלא את כל השדות" });
      return;
    }

    setLoading(true);
    const result = await onUpload(file, column, value);
    
    if (result.success) {
      setMessage({ type: "success", text: result.message });
      // Set the filtered data for table display
      result.data.forEach(item => {
        if (item._images && item._images.length > 0) {
            item.תמונה = item._images[0]; // שים את הערך הראשון של _images במפתח "תמונה"
        }
        delete item._images; // מחיקה של _images
      });
      setFilteredData(result.data);
      // Reset form
      setFile(null);
      setColumn("");
      setValue("");
    } else {
      setMessage({ type: "error", text: result.message });
      setFilteredData(null);
    }
    
    setLoading(false);
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  {console.log(filteredData)}
  return (
    <div className="app-container">
      <div className="home-container">
        <div className="home-header">
          <div>
            <h1>מערכת סינון קבצי Excel</h1>
            <p style={{ color: "#666", marginTop: "5px" }}>{email}</p>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            התנתק
          </button>
        </div>

        <div className="content-wrapper">
          <div className="upload-section">
            <h2>העלה וסנן קובץ Excel</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="file-input-wrapper">
                <label htmlFor="file-upload" className="file-input-label">
                  <i>📁</i>
                  <div className="upload-text">
                    {file ? file.name : "לחץ להעלאת קובץ"}
                  </div>
                  <div className="upload-subtext">
                    קבצי Excel בלבד (.xlsx, .xls)
                  </div>
                </label>
                <input 
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={e => setFile(e.target.files[0])}
                />
              </div>

              <div className="input-row">
                <div className="form-group">
                  <label>שם העמודה</label>
                  <input 
                    type="text"
                    placeholder='למשל: "סניף"'
                    value={column}
                    onChange={e => setColumn(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ערך לסינון</label>
                  <input 
                    type="text"
                    placeholder='למשל: "תל אביב"'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-upload" 
                disabled={loading || !file}
              >
                {loading ? "מעבד..." : "סנן והורד קובץ"}
                {loading && <span className="spinner"></span>}
              </button>
            </form>

            {message.text && (
              <div className={`${message.type}-message`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Results Table */}
          {filteredData && filteredData.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h2>תוצאות הסינון</h2>
                <span className="results-count">
                  {filteredData.length} שורות נמצאו
                </span>
              </div>
              
              {/* Desktop Table View */}
<div className="table-wrapper">
  <table className="results-table">
    <thead>
      <tr>
        {Object.keys(filteredData[0]).map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredData.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {Object.entries(row).map(([key, cell], cellIndex) => (
            <td key={cellIndex}>
              {key === "תמונה" ? (
                cell ? (
                  <div className="table-images">
                    <img 
                      src={`data:image/jpeg;base64,${cell}`}
                      className="table-image"
                      alt="תמונה"
                    />
                  </div>
                ) : (
                  <span style={{ color: '#999' }}>--</span>
                )
              ) : (
                cell || "-"
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile Card View */}
<div className="table-mobile-view">
  {filteredData.map((row, rowIndex) => (
    <div key={rowIndex} className="table-card">
      {Object.entries(row)
        .filter(([key]) => key !== '_images') // _images כבר לא רלוונטי
        .map(([key, value], index) => (
          <div key={index} className="table-card-row">
            <div className="table-card-label">{key}</div>
            <div className="table-card-value">
              {key === "תמונה" ? (
                value ? (
                  <img
                    src={`data:image/jpeg;base64,${value}`}
                    alt="תמונה"
                    className="table-image-mobile"
                  />
                ) : (
                  <span style={{ color: '#999' }}>--</span>
                )
              ) : (
                value || "-"
              )}
            </div>
          </div>
      ))}
    </div>
  ))}
</div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;