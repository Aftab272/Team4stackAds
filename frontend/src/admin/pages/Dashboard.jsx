import React, { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { FiUsers, FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp, FiActivity } from 'react-icons/fi'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDashboardStats } from '../services/adminApi'
import { showError } from '../../services/notify'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [userGrowthData, setUserGrowthData] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await getDashboardStats()
      const { stats, recentActivity, userGrowth } = response.data

      setStats(stats)
      setRecentActivity(recentActivity.slice(0, 5))
      
      // Prepare user growth chart data
      const dates = Object.keys(userGrowth)
      const counts = Object.values(userGrowth)
      
      setUserGrowthData({
        labels: dates,
        datasets: [{
          label: 'New Users',
          data: counts,
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          tension: 0.4,
          fill: true,
        }],
      })
    } catch (error) {
      showError(error, 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const activityColumns = [
    { header: 'Type', render: (row) => row.type || 'Transaction' },
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', render: (row) => `$${row.amount}` },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ]

  const userGrowthChartData = {
    labels: userGrowthData?.labels || [],
    datasets: userGrowthData?.datasets || [],
  }

  const ownerProfitByPackage = [
    { name: 'Starter', profit: 'Rs. 50/day' },
    { name: 'Basic', profit: 'Rs. 80/day' },
    { name: 'Standard', profit: 'Rs. 120/day' },
    { name: 'Premium', profit: 'Rs. 200/day' },
    { name: 'VIP', profit: 'Rs. 300/day' },
    { name: 'Elite', profit: 'Rs. 450/day' },
  ]

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
    <div className="admin-dashboard">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">Welcome to Team4StackAds Admin Panel</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={FiUsers}
            color="primary"
            trend={12}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={FiCheckCircle}
            color="success"
            trend={8}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard
            title="Total Earnings"
            value={`$${stats?.totalEarnings?.toFixed(2) || '0.00'}`}
            icon={FiDollarSign}
            color="info"
            trend={15}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard
            title="Pending Withdrawals"
            value={stats?.pendingWithdrawals || 0}
            icon={FiClock}
            color="warning"
          />
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <StatCard
            title="Completed Withdrawals"
            value={stats?.completedWithdrawals || 0}
            icon={FiTrendingUp}
            color="success"
          />
        </Col>
        <Col md={6} lg={4}>
          <StatCard
            title="Total Tasks"
            value={stats?.totalTasks || 0}
            icon={FiActivity}
            color="danger"
          />
        </Col>
        <Col md={6} lg={4}>
          <StatCard
            title="Completion Rate"
            value={`${((stats?.completedWithdrawals / (stats?.completedWithdrawals + stats?.pendingWithdrawals || 1)) * 100).toFixed(0)}%`}
            icon={FiCheckCircle}
            color="info"
            trend={5}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Growth (Last 30 Days)</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-box">
                {userGrowthData && userGrowthData.labels.length > 0 ? (
                  <Line data={userGrowthChartData} options={chartOptions} />
                ) : (
                  <div className="text-center text-muted py-5">
                    No user growth data available
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                <div className="stat-item">
                  <div className="d-flex justify-content-between">
                    <span>Total Balance:</span>
                    <strong>${stats?.totalEarnings?.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="d-flex justify-content-between">
                    <span>Pending Actions:</span>
                    <strong className="text-warning">{stats?.pendingWithdrawals}</strong>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="d-flex justify-content-between">
                    <span>Active Tasks:</span>
                    <strong>{stats?.totalTasks}</strong>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="d-flex justify-content-between">
                    <span>Owner Profit (Daily):</span>
                    <strong>Per Package</strong>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-2">
                    {ownerProfitByPackage.map((item) => (
                      <div key={item.name} className="d-flex justify-content-between">
                        <span>{item.name}</span>
                        <strong>{item.profit}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <DataTable 
                columns={activityColumns}
                data={recentActivity}
                loading={false}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
