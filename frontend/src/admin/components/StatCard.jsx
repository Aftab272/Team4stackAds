import React from 'react'
import { Card } from 'react-bootstrap'

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  return (
    <Card className="stat-card">
      <Card.Body>
        <div className="stat-card-header">
          <div className={`stat-icon ${color}`}>
            <Icon size={24} />
          </div>
          {trend && (
            <span className={`stat-trend ${trend > 0 ? 'trend-positive' : 'trend-negative'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <h2 className="stat-value">{value.toLocaleString()}</h2>
        <p className="stat-label">{title}</p>
      </Card.Body>
    </Card>
  )
}

export default StatCard
