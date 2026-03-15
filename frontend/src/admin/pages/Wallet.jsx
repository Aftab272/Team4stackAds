import React, { useState, useEffect } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllWalletTransactions, getWalletStatistics } from '../services/adminApi'
import { FiDollarSign, FiTrendingUp, FiCreditCard } from 'react-icons/fi'

const Wallet = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [statistics, setStatistics] = useState(null)

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllWalletTransactions({ page, limit: 50 })
      setTransactions(response.data.transactions)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await getWalletStatistics()
      setStatistics(response.data.statistics)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchStatistics()
  }, [])

  const columns = [
    { header: 'User', render: (row) => `${row.userName} (${row.userEmail})` },
    { 
      header: 'Type', 
      render: (row) => (
        <span className={`badge bg-${row.type === 'credit' ? 'success' : 'danger'}`}>
          {row.type.toUpperCase()}
        </span>
      )
    },
    { header: 'Amount', render: (row) => `$${row.amount.toFixed(2)}` },
    { header: 'Balance After', render: (row) => `$${row.balance_after.toFixed(2)}` },
    { header: 'Description', accessor: 'description' },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() }
  ]

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Wallet Management</h2>
        <p className="text-muted">Monitor all wallet transactions</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-start border-4 border-primary h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Balance</h6>
                  <h3 className="mb-0">${statistics?.totalBalance?.toFixed(2) || '0.00'}</h3>
                </div>
                <FiDollarSign size={32} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-start border-4 border-success h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Earned</h6>
                  <h3 className="mb-0">${statistics?.totalEarned?.toFixed(2) || '0.00'}</h3>
                </div>
                <FiTrendingUp size={32} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-start border-4 border-info h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Transactions</h6>
                  <h3 className="mb-0">{statistics?.totalTransactions || 0}</h3>
                </div>
                <FiCreditCard size={32} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={transactions}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchTransactions(page)}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default Wallet
