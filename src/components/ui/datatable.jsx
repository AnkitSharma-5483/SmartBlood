
const DataTable = ({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No records found.",
  minWidth = "650px",
  rowKey = "id",
  className = "",
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className="w-full text-left text-sm"
        style={{ minWidth }}
      >
        {/* Table Header */}
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-5 py-4 font-semibold"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) =>
              renderRow ? (
                renderRow(item, index)
              ) : (
                <tr
                  key={item[rowKey] ?? index}
                  className="border-t transition hover:bg-slate-50"
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="px-5 py-4"
                    >
                      {item[column]}
                    </td>
                  ))}
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={Math.max(columns.length, 1)}
                className="px-5 py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
