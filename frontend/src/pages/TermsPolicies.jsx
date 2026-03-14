import React from 'react'
import { Container, Card, Button, Accordion } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const TermsPolicies = () => {
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
          <h2 className="mb-4">Terms & Policies</h2>
          <p className="text-muted mb-4">
            Welcome to Team4stackAds - Your trusted investment and earning platform. Please read our terms and policies carefully.
          </p>

          <Accordion defaultActiveKey="0" className="mt-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Privacy Policy</Accordion.Header>
              <Accordion.Body>
                <h5>1. Information We Collect</h5>
                <ul>
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and identification details when you register</li>
                  <li><strong>Financial Information:</strong> Wallet addresses, transaction history, and payment details</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform, tasks completed, and earning activities</li>
                  <li><strong>Device Information:</strong> IP address, browser type, and device information for security purposes</li>
                </ul>

                <h5 className="mt-3">2. How We Use Your Information</h5>
                <ul>
                  <li>To provide and maintain our investment services</li>
                  <li>To process transactions and manage your earnings</li>
                  <li>To send you updates about tasks, promotions, and platform features</li>
                  <li>To detect and prevent fraud and unauthorized access</li>
                  <li>To comply with legal obligations and improve our services</li>
                </ul>

                <h5 className="mt-3">3. Data Protection</h5>
                <ul>
                  <li>We implement industry-standard encryption and security measures</li>
                  <li>Your data is stored on secure servers with restricted access</li>
                  <li>We never sell your personal information to third parties</li>
                  <li>Data is only shared with trusted service providers necessary for operations</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/privacy-policy')} className="mt-2">Read Full Privacy Policy →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Terms & Conditions</Accordion.Header>
              <Accordion.Body>
                <h5>1. Acceptance of Terms</h5>
                <p>By accessing and using Team4stackAds, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the platform immediately.</p>

                <h5 className="mt-3">2. Eligibility</h5>
                <ul>
                  <li>You must be at least 18 years old to use this platform</li>
                  <li>You must have legal capacity to enter into binding contracts</li>
                  <li>You are responsible for providing accurate and complete registration information</li>
                  <li>One account per user - multiple accounts may result in suspension</li>
                </ul>

                <h5 className="mt-3">3. Investment & Earning Rules</h5>
                <ul>
                  <li>All investments are subject to market risks and conditions</li>
                  <li>Earnings are calculated based on completed tasks and platform activities</li>
                  <li>Minimum withdrawal amounts apply as specified in the Wallet section</li>
                  <li>Withdrawal processing times vary by method (typically 24-72 hours)</li>
                  <li>We reserve the right to modify earning rates with prior notice</li>
                </ul>

                <h5 className="mt-3">4. User Responsibilities</h5>
                <ul>
                  <li>Maintain confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Complete tasks honestly and without manipulation</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not engage in fraudulent, abusive, or illegal activities</li>
                </ul>

                <h5 className="mt-3">5. Prohibited Activities</h5>
                <ul>
                  <li>Using bots, scripts, or automated tools to complete tasks</li>
                  <li>Creating fake accounts or manipulating referral systems</li>
                  <li>Attempting to hack, breach, or exploit platform vulnerabilities</li>
                  <li>Sharing confidential platform information publicly</li>
                  <li>Misusing the referral or team system</li>
                </ul>

                <h5 className="mt-3">6. Limitation of Liability</h5>
                <p>Team4stackAds is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from use of the platform.</p>
                <Button variant="link" onClick={() => navigate('/terms')} className="mt-2">Read Full Terms & Conditions →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Account History</Accordion.Header>
              <Accordion.Body>
                <h5>Transaction Records</h5>
                <p>Team4stackAds maintains complete records of all your account activities including:</p>
                <ul>
                  <li><strong>Deposits:</strong> All investment amounts with dates and transaction IDs</li>
                  <li><strong>Withdrawals:</strong> Withdrawal requests, amounts, status, and completion dates</li>
                  <li><strong>Earnings:</strong> Daily task completions, bonuses, and commission earnings</li>
                  <li><strong>Referrals:</strong> Team member activities and referral commissions</li>
                  <li><strong>Balance Changes:</strong> Complete ledger of all credits and debits</li>
                </ul>

                <h5 className="mt-3">Accessing Your History</h5>
                <ul>
                  <li>Navigate to Account History from the dashboard</li>
                  <li>Filter by date range, transaction type, or status</li>
                  <li>Download statements in PDF or CSV format</li>
                  <li>All records are retained for minimum 5 years</li>
                </ul>

                <h5 className="mt-3">Record Accuracy</h5>
                <p>If you notice any discrepancies in your account history:</p>
                <ul>
                  <li>Contact support within 30 days of the transaction</li>
                  <li>Provide transaction ID and supporting documentation</li>
                  <li>Our team will investigate within 5-7 business days</li>
                  <li>Corrections will be made promptly if errors are found</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/account-history')} className="mt-2">View Your Account History →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Search History</Accordion.Header>
              <Accordion.Body>
                <h5>What We Track</h5>
                <p>Team4stackAds tracks search activities to improve user experience and provide relevant opportunities:</p>
                <ul>
                  <li>Tasks and investment products you search for</li>
                  <li>Filters and criteria used in searches</li>
                  <li>Frequency and timing of search activities</li>
                  <li>Click-through rates on search results</li>
                </ul>

                <h5 className="mt-3">Purpose of Tracking</h5>
                <ul>
                  <li>To personalize your dashboard with relevant tasks</li>
                  <li>To recommend suitable investment opportunities</li>
                  <li>To improve platform search functionality</li>
                  <li>To analyze user preferences and platform usage patterns</li>
                </ul>

                <h5 className="mt-3">Your Control</h5>
                <ul>
                  <li>View your complete search history in Settings</li>
                  <li>Clear individual search entries or entire history</li>
                  <li>Opt-out of personalized recommendations</li>
                  <li>Search history is retained for 12 months by default</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/search-history')} className="mt-2">View Search History →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Security & Permissions</Accordion.Header>
              <Accordion.Body>
                <h5>Account Security Features</h5>
                <ul>
                  <li><strong>Two-Factor Authentication (2FA):</strong> Optional extra layer of security</li>
                  <li><strong>Login Notifications:</strong> Email alerts for new device logins</li>
                  <li><strong>Session Management:</strong> View and terminate active sessions</li>
                  <li><strong>Password Requirements:</strong> Strong password policy with regular updates</li>
                  <li><strong>IP Whitelisting:</strong> Restrict access to trusted IP addresses</li>
                </ul>

                <h5 className="mt-3">Platform Security Measures</h5>
                <ul>
                  <li>SSL/TLS encryption for all data transmissions</li>
                  <li>Secure wallet integration with multi-signature support</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Real-time fraud detection and prevention systems</li>
                  <li>Cold storage for majority of platform funds</li>
                </ul>

                <h5 className="mt-3">Permission Levels</h5>
                <ul>
                  <li><strong>Basic User:</strong> Complete tasks, view earnings, make withdrawals</li>
                  <li><strong>Verified User:</strong> Higher withdrawal limits, priority support (after KYC)</li>
                  <li><strong>Team Leader:</strong> Access to team management and commission tracking</li>
                  <li><strong>Admin:</strong> Platform management capabilities</li>
                </ul>

                <h5 className="mt-3">Security Best Practices</h5>
                <ul>
                  <li>Never share your password or 2FA codes</li>
                  <li>Use unique passwords for your account</li>
                  <li>Enable login notifications and session alerts</li>
                  <li>Log out from shared or public devices</li>
                  <li>Keep your registered email and phone updated</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/security-permissions')} className="mt-2">Manage Security Settings →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Accessibility</Accordion.Header>
              <Accordion.Body>
                <h5>Our Commitment</h5>
                <p>Team4stackAds is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

                <h5 className="mt-3">Accessibility Features</h5>
                <ul>
                  <li><strong>Screen Reader Support:</strong> Compatible with major screen readers (JAWS, NVDA, VoiceOver)</li>
                  <li><strong>Keyboard Navigation:</strong> Full platform functionality using keyboard only</li>
                  <li><strong>Text Alternatives:</strong> Alt text for all images and icons</li>
                  <li><strong>Color Contrast:</strong> WCAG AA compliant color contrast ratios</li>
                  <li><strong>Responsive Design:</strong> Accessible on desktop, tablet, and mobile devices</li>
                  <li><strong>Font Scaling:</strong> Adjustable text size up to 200% without loss of functionality</li>
                </ul>

                <h5 className="mt-3">Conformance Status</h5>
                <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Team4stackAds is partially conformant with WCAG 2.1 level AA.</p>

                <h5 className="mt-3">Feedback & Support</h5>
                <ul>
                  <li>Report accessibility barriers via Help Center</li>
                  <li>Request alternative formats for platform content</li>
                  <li>Suggest accessibility improvements</li>
                  <li>We respond to accessibility requests within 48 hours</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/accessibility')} className="mt-2">View Accessibility Statement →</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>Help Center</Accordion.Header>
              <Accordion.Body>
                <h5>Getting Started</h5>
                <ul>
                  <li><strong>Registration:</strong> Create account, verify email, complete profile</li>
                  <li><strong>First Investment:</strong> Browse tasks, select investment amount, confirm</li>
                  <li><strong>Completing Tasks:</strong> Daily login, view tasks, complete actions, earn rewards</li>
                  <li><strong>Withdrawals:</strong> Request withdrawal, choose method, receive funds</li>
                </ul>

                <h5 className="mt-3">Common Questions</h5>
                <ul>
                  <li><strong>Minimum Investment:</strong> Start earning with as little as $10</li>
                  <li><strong>Payment Methods:</strong> Bank transfer, cryptocurrency, e-wallets</li>
                  <li><strong>Withdrawal Time:</strong> 24-72 hours for processing</li>
                  <li><strong>Referral Bonus:</strong> Earn 10% of your referrals' earnings</li>
                  <li><strong>Task Availability:</strong> New tasks added daily</li>
                </ul>

                <h5 className="mt-3">Contact Support</h5>
                <ul>
                  <li><strong>Email:</strong> support@team4stackads.com</li>
                  <li><strong>Live Chat:</strong> Available 9 AM - 6 PM EST, Monday-Saturday</li>
                  <li><strong>Response Time:</strong> Within 24 hours for email inquiries</li>
                  <li><strong>Emergency Support:</strong> For critical account issues</li>
                </ul>

                <h5 className="mt-3">Additional Resources</h5>
                <ul>
                  <li>Video tutorials on platform features</li>
                  <li>FAQ section with common questions</li>
                  <li>Blog with earning tips and strategies</li>
                  <li>Community forum for user discussions</li>
                </ul>
                <Button variant="link" onClick={() => navigate('/help-center')} className="mt-2">Visit Help Center →</Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="mt-4 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Last Updated:</strong> March 2026 | These policies may be updated periodically. Please review regularly.
              By using Team4stackAds, you acknowledge that you have read and understood these terms and policies.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TermsPolicies
