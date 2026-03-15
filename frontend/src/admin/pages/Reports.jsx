import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '../components/LoadingSpinner'
import { getReports } from '../services/adminApi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [reportType])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await getReports(reportType)
      setReportData(response.data.report)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading reports..." />

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Reports & Analytics</h2>
        <p className="text-muted">Platform performance insights</p>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Select
            className="admin-filter-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="user-growth">User Growth</option>
            <option value="task-statistics">Task Statistics</option>
            <option value="withdraw-trends">Withdraw Trends</option>
            <option value="revenue">Revenue Analytics</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {reportData?.userGrowth && (
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Registration Growth</h5>
              </Card.Header>
              <Card.Body>
                <div className="chart-box">
                  <Line
                    data={{
                      labels: Object.keys(reportData.userGrowth),
                      datasets: [{
                        label: 'New Users',
                        data: Object.values(reportData.userGrowth),
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.taskStatistics && (
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Task Completion Stats</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-4">
                  <h2 className="display-4 fw-bold mb-3">
                    {reportData.taskStatistics.completedTasks} / {reportData.taskStatistics.totalTasks}
                  </h2>
                  <p className="text-muted">Tasks Completed</p>
                  <div className="progress mt-3" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${reportData.taskStatistics.completionRate}%` }}
                    />
                  </div>
                  <p className="mt-2">Completion Rate: <strong>{reportData.taskStatistics.completionRate}%</strong></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.withdrawTrends && (
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Withdrawal Statistics</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span>Total Requests:</span>
                    <strong className="fs-5">{reportData.withdrawTrends.total}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded">
                    <span>Approved:</span>
                    <strong className="text-success fs-5">{reportData.withdrawTrends.approved}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-warning bg-opacity-10 rounded">
                    <span>Pending:</span>
                    <strong className="text-warning fs-5">{reportData.withdrawTrends.pending}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded">
                    <span>Rejected:</span>
                    <strong className="text-danger fs-5">{reportData.withdrawTrends.rejected}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-info bg-opacity-10 rounded">
                    <span>Total Amount:</span>
                    <strong className="text-info fs-5">${reportData.withdrawTrends.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.revenue && (
          <>
            <Col lg={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Revenue Overview</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <h2 className="display-3 fw-bold text-success mb-2">
                      ${reportData.revenue.totalEarned.toFixed(2)}
                    </h2>
                    <p className="text-muted">Total Earned Across Platform</p>
                    <hr />
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Total Balance</small>
                        <p className="fw-bold">${reportData.revenue.totalBalance.toFixed(2)}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Active Users</small>
                        <p className="fw-bold">{reportData.revenue.activeUsers}</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">User Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-3">
                    <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                      <h4 className="mb-1">{reportData.revenue.activeUsers}</h4>
                      <small className="text-muted">Active Users</small>
                    </div>
                    <div className="p-3 bg-success bg-opacity-10 rounded text-center">
                      <h4 className="mb-1">${reportData.revenue.averagePerUser}</h4>
                      <small className="text-muted">Average Per User</small>
                    </div>
                    <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                      <h4 className="mb-1">${reportData.revenue.totalBalance.toFixed(2)}</h4>
                      <small className="text-muted">Total Balance in Circulation</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  )
}

export default Reports
