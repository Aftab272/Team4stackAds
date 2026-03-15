import React from 'react'
import { Table, Spinner, Pagination } from 'react-bootstrap'

const DataTable = ({ 
  columns, 
  data, 
  loading = false,
  pagination,
  onPageChange 
}) => {
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading data...</p>
      </div>
    )
  }

  return (
    <div className="data-table-wrapper">
      <Table responsive hover className="admin-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                <p className="text-muted">No data available</p>
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-container">
          <Pagination className="mb-0">
            <Pagination.First 
              onClick={() => onPageChange(1)} 
              disabled={pagination.page === 1}
            />
            <Pagination.Prev 
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            />
            
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
              let pageNum = i + 1
              if (pagination.totalPages > 5) {
                if (pagination.page > 3) {
                  pageNum = pagination.page - 2 + i
                }
                if (pageNum > pagination.totalPages) {
                  pageNum = pagination.totalPages - 4 + i
                }
              }
              
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === pagination.page}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              )
            })}
            
            <Pagination.Next 
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            />
            <Pagination.Last 
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default DataTable
