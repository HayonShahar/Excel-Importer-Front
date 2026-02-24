import { useRef, useState } from "react";
import "../styles/ExcelImport.css";
import ExcelDataTable from "../components/ExcelDataTable";

function ExcelImport({ onUpload }) {
  const [file, setFile] = useState(null);
  const [column, setColumn] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filteredData, setFilteredData] = useState(null);
  const fileInputRef = useRef(null);

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
      result.data.forEach(item => {
        if (item._images && item._images.length > 0) {
            item.תמונה = item._images[0];
        }
        delete item._images; 
      });
      setFilteredData(result.data);
      setFile(null);
      setColumn("");
      setValue("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setMessage({ type: "error", text: result.message });
      setFilteredData(null);
    }
    
    setLoading(false);
    
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  return (
    <div className="excel-import-content dashboard-content">
      <section className="excel-upload-section">
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
                  ref={fileInputRef}
                  onClick={(e) => {
                    e.currentTarget.value = "";
                  }}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
      </section>

      {filteredData && filteredData.length > 0 && (
        <ExcelDataTable
          data={filteredData}
          title="תוצאות הסינון"
          countLabel="שורות נמצאו"
        />
      )}
    </div>
  );
}

export default ExcelImport;