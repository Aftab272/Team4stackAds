import React from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <Container className="py-5">
      <div className="back-button-container mb-3">
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4">Privacy Policy</h2>
          <p className="text-muted">
            <strong>Last Updated:</strong> March 15, 2026
          </p>
          
          <hr className="my-4" />

          <h5>Introduction</h5>
          <p>
            Welcome to Team4stackAds ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our investment and earning platform.
            By accessing or using Team4stackAds, you consent to the data practices described in this policy.
          </p>

          <h5 className="mt-4">1. Information We Collect</h5>
          
          <h6 className="mt-3">1.1 Personal Information</h6>
          <ul>
            <li><strong>Registration Data:</strong> Full name, email address, phone number, username, password</li>
            <li><strong>Profile Information:</strong> Profile picture, bio, country of residence</li>
            <li><strong>Identification Documents:</strong> Government-issued ID for KYC verification (when required)</li>
            <li><strong>Date of Birth:</strong> To verify you meet the minimum age requirement of 18 years</li>
          </ul>

          <h6 className="mt-3">1.2 Financial Information</h6>
          <ul>
            <li><strong>Wallet Addresses:</strong> Cryptocurrency wallet addresses for deposits and withdrawals</li>
            <li><strong>Bank Account Details:</strong> Bank account information for fiat currency transactions</li>
            <li><strong>Transaction History:</strong> Records of all deposits, withdrawals, investments, and earnings</li>
            <li><strong>Payment Method Information:</strong> Credit/debit card details (processed securely through payment processors)</li>
          </ul>

          <h6 className="mt-3">1.3 Usage and Activity Data</h6>
          <ul>
            <li><strong>Task Activity:</strong> Tasks viewed, completed, time spent on tasks</li>
            <li><strong>Investment Choices:</strong> Investment plans selected, amounts invested, duration</li>
            <li><strong>Earning Records:</strong> Daily earnings, bonuses, commissions, referral income</li>
            <li><strong>Login History:</strong> Login times, frequency, session duration</li>
            <li><strong>Platform Interactions:</strong> Features used, pages visited, clicks</li>
          </ul>

          <h6 className="mt-3">1.4 Technical and Device Information</h6>
          <ul>
            <li><strong>Device Information:</strong> Computer or mobile device model, operating system</li>
            <li><strong>Browser Information:</strong> Browser type, version, language settings</li>
            <li><strong>IP Address:</strong> Internet Protocol address and geographic location</li>
            <li><strong>Log Data:</strong> Server logs, access times, pages viewed, referring website</li>
            <li><strong>Cookies:</strong> Information collected through cookies and similar technologies</li>
          </ul>

          <h5 className="mt-4">2. How We Use Your Information</h5>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li><strong>Service Provision:</strong> To create and maintain your account, process transactions, and provide customer support</li>
            <li><strong>Investment Management:</strong> To manage your investments, calculate earnings, and process withdrawals</li>
            <li><strong>Communication:</strong> To send you service updates, promotional offers, newsletters, and respond to inquiries</li>
            <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and illegal activities</li>
            <li><strong>Compliance:</strong> To comply with legal obligations, regulations, and lawful requests</li>
            <li><strong>Analytics:</strong> To analyze usage patterns, improve platform features, and optimize user experience</li>
            <li><strong>Personalization:</strong> To customize content, recommend tasks, and show relevant advertisements</li>
            <li><strong>Research:</strong> To conduct market research and surveys for platform improvement</li>
          </ul>

          <h5 className="mt-4">3. Legal Basis for Processing (GDPR)</h5>
          <p>If you are located in the European Economic Area (EEA), our legal basis for processing your information includes:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contractual obligations to you</li>
            <li><strong>Legal Obligation:</strong> Processing required by applicable laws and regulations</li>
            <li><strong>Vital Interests:</strong> Processing to protect your vital interests or those of another person</li>
            <li><strong>Public Interest:</strong> Processing for tasks carried out in the public interest</li>
            <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests, provided they do not override your rights</li>
            <li><strong>Consent:</strong> Processing based on your explicit consent (which you may withdraw at any time)</li>
          </ul>

          <h5 className="mt-4">4. How We Share Your Information</h5>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
          
          <h6 className="mt-3">4.1 Service Providers</h6>
          <p>We work with trusted third-party service providers who assist us in operating our platform:</p>
          <ul>
            <li><strong>Payment Processors:</strong> To process deposits and withdrawals securely</li>
            <li><strong>Cloud Hosting:</strong> To store and manage data on secure servers</li>
            <li><strong>Email Services:</strong> To send transactional and promotional emails</li>
            <li><strong>Analytics Providers:</strong> To analyze platform usage and performance</li>
            <li><strong>KYC Verification:</strong> To verify identity documents for compliance</li>
          </ul>

          <h6 className="mt-3">4.2 Legal Requirements</h6>
          <p>We may disclose your information if required by law or in response to valid requests by public authorities:</p>
          <ul>
            <li>To comply with court orders, subpoenas, or legal processes</li>
            <li>To respond to government or regulatory agency requests</li>
            <li>To protect the rights, property, or safety of Team4stackAds, our users, or others</li>
            <li>To enforce our Terms and Conditions</li>
          </ul>

          <h6 className="mt-3">4.3 Business Transfers</h6>
          <p>In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, user information may be transferred as part of the transaction.</p>

          <h5 className="mt-4">5. Data Retention</h5>
          <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:</p>
          <ul>
            <li><strong>Account Information:</strong> Retained while your account is active plus 5 years</li>
            <li><strong>Transaction Records:</strong> Retained for minimum 5 years for compliance</li>
            <li><strong>Usage Data:</strong> Retained for 2 years for analytics purposes</li>
            <li><strong>Marketing Data:</strong> Retained until you opt-out or 3 years, whichever is sooner</li>
          </ul>
          <p>After these periods, data is either deleted or anonymized for statistical purposes.</p>

          <h5 className="mt-4">6. Your Data Protection Rights</h5>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request copies of your personal information</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal information ("Right to be Forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your data</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organization</li>
            <li><strong>Right to Object:</strong> Object to processing of your data for specific purposes</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise these rights, contact us at <strong>privacy@team4stackads.com</strong>. We will respond within 30 days.</p>

          <h5 className="mt-4">7. International Data Transfers</h5>
          <p>Your information may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the privacy laws may not be as protective as those in your jurisdiction. We ensure appropriate safeguards are in place, including:</p>
          <ul>
            <li>Standard Contractual Clauses approved by relevant authorities</li>
            <li>Privacy Shield Framework certification where applicable</li>
            <li>Binding Corporate Rules for intra-group transfers</li>
          </ul>

          <h5 className="mt-4">8. Security Measures</h5>
          <p>We implement industry-standard security measures to protect your personal information:</p>
          <ul>
            <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission; AES-256 encryption for data at rest</li>
            <li><strong>Access Controls:</strong> Multi-factor authentication, role-based access, biometric verification</li>
            <li><strong>Network Security:</strong> Firewalls, intrusion detection systems, regular security audits</li>
            <li><strong>Data Minimization:</strong> Only collecting and retaining necessary information</li>
            <li><strong>Employee Training:</strong> Regular privacy and security training for all staff</li>
            <li><strong>Incident Response:</strong> Procedures to detect, contain, and remediate data breaches</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>

          <h5 className="mt-4">9. Cookies and Tracking Technologies</h5>
          <p>We use cookies and similar tracking technologies to enhance your experience:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for platform functionality (session management, security)</li>
            <li><strong>Performance Cookies:</strong> Collect anonymous data about platform usage</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Show relevant ads and measure campaign effectiveness</li>
          </ul>
          <p>You can control cookies through your browser settings. Disabling cookies may affect platform functionality.</p>

          <h5 className="mt-4">10. Children's Privacy</h5>
          <p>Team4stackAds is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>

          <h5 className="mt-4">11. Changes to This Privacy Policy</h5>
          <p>We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes:</p>
          <ul>
            <li>We will update the "Last Updated" date at the top of this policy</li>
            <li>We will notify you via email or platform notification for significant changes</li>
            <li>The updated policy will be effective immediately upon posting</li>
            <li>Your continued use constitutes acceptance of the updated policy</li>
          </ul>

          <h5 className="mt-4">12. Contact Us</h5>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> privacy@team4stackads.com</li>
            <li><strong>Support:</strong> support@team4stackads.com</li>
            <li><strong>Address:</strong> [Your Business Address]</li>
            <li><strong>Data Protection Officer:</strong> dpo@team4stackads.com (for EU users)</li>
          </ul>

          <div className="alert alert-info mt-4" role="alert">
            <strong>Note:</strong> This Privacy Policy is designed to comply with major privacy regulations including GDPR (EU), CCPA (California), PIPEDA (Canada), and other applicable data protection laws.
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PrivacyPolicy
