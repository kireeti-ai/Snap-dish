const DataTable = ({ columns, data }) => {
  return (
    <table className="w-full bg-white shadow rounded-lg">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="text-left px-4 py-2 border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-gray-100">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 border-b">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
