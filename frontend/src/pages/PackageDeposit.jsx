import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiImage } from 'react-icons/fi'
import './Page.css'
import './PackageDeposit.css'

const PackageDeposit = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPackage = location.state?.package
  const [formData, setFormData] = useState({
    transactionId: '',
    phoneNumber: '',
    proofImage: null
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, proofImage: file }))
  }

  const canSubmit =
    formData.transactionId.trim() &&
    formData.phoneNumber.trim() &&
    formData.proofImage

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="back-button-container">
          <button
            type="button"
            className="back-dashboard-button"
            onClick={() => navigate('/work')}
          >
            <FiArrowLeft />
            Back to Packages
          </button>
        </div>

        <div className="deposit-title-box">
          <h2 className="page-title deposit-title">Package Deposit</h2>
        </div>

        <div className="deposit-card">
          <div className="deposit-top">
            <div>
              <h3>Send Payment First</h3>
              <p>Complete your payment and upload the proof to continue.</p>
            </div>
            <div className="deposit-package">
              <span>Selected Package</span>
              <strong>{selectedPackage?.name || 'Not Selected'}</strong>
              <span className="deposit-price">{selectedPackage?.price || '--'}</span>
            </div>
          </div>

          <div className="deposit-account">
            <div className="jazzcash-icon">JC</div>
            <div>
              <p className="deposit-label">JazzCash Account</p>
              <h4>Muhammad Manzoor</h4>
              <span>03027434569</span>
            </div>
          </div>

          <form className="deposit-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Transaction ID</label>
              <input
                className="form-input"
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                placeholder="Enter transaction ID"
                required
              />
            </div>
            <div className="form-field">
              <label>Sender Phone Number</label>
              <input
                className="form-input"
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="form-field">
              <label>Transaction Screenshot</label>
              <label className="upload-box">
                <FiImage />
                <span>{formData.proofImage ? formData.proofImage.name : 'Upload proof image'}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <button type="submit" className="deposit-submit" disabled={!canSubmit}>
              Submit & Continue
            </button>
          </form>

          {submitted && (
            <div className="deposit-success">
              <FiCheckCircle />
              <div>
                <h4>Payment submitted</h4>
                <p>Your payment is under review. The next process will start soon.</p>
                <button
                  type="button"
                  className="deposit-next"
                  onClick={() => navigate('/work')}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PackageDeposit
