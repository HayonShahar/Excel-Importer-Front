import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ExcelDataTable from "../../components/ExcelDataTable";
import "../../styles/ExcelImport.css";

export const ExportToList = ({ userEmail, onLogout, onNavigate, onExportToList }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [data, setData] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !onExportToList) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setMessage({ type: "error", text: "נא להעלות קובץ Excel בלבד (.xlsx, .xls)" });
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await onExportToList(selectedFile);

    if (result.success) {
      setData(result.data);
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
      setData(null);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setData(null);
    setMessage({ type: "", text: "" });
  };

  return (
    <DashboardLayout userEmail={userEmail} onLogout={onLogout} onNavigate={onNavigate} activeItem="exportToList">
      <div className="excel-import-content dashboard-content">
        <section className="excel-upload-section export-list-upload">
          <h2>ייצוא רשימה מקובץ Excel</h2>
          <p className="export-list-subtitle">
            העלה קובץ Excel לצפייה בנתונים כרשימה מסודרת. אין צורך בסינון – כל הנתונים יוצגו.
          </p>

          <div className="file-input-wrapper">
            <label htmlFor="export-file-upload" className="file-input-label">
              <i>📁</i>
              <div className="upload-text">{file ? file.name : "לחץ להעלאת קובץ Excel"}</div>
              <div className="upload-subtext">קבצי Excel בלבד (.xlsx, .xls)</div>
            </label>
            <input
              id="export-file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {file && (
            <button type="button" className="btn-reset" onClick={handleReset} disabled={loading}>
              נקה והעלה קובץ אחר
            </button>
          )}

          {loading && (
            <div className="export-loading">
              <span className="spinner"></span>
              <span>טוען נתונים...</span>
            </div>
          )}

          {message.text && (
            <div className={`${message.type}-message`}>{message.text}</div>
          )}
        </section>

        {data && data.length > 0 && (
          <ExcelDataTable data={data} title="הנתונים מהקובץ" countLabel="שורות" />
        )}
      </div>
    </DashboardLayout>
  );
};
