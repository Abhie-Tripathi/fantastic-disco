import { useState } from 'react';
import Papa from 'papaparse';

const CsvUpload = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  // Handle file change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        setError('');
      },
      header: true, // assuming the first row contains headers
      skipEmptyLines: true, // skip empty lines
      error: (err) => {
        setError('Error parsing file');
        console.error(err);
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {csvData.length > 0 && (
        <div>
          <h3>CSV Data:</h3>
          <table border={1} style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;
