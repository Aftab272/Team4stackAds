import React from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
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
          <h2 className="mb-4">Terms & Conditions</h2>
          <p className="text-muted">
            <strong>Last Updated:</strong> March 15, 2026
          </p>
          
          <hr className="my-4" />

          <h5>Introduction</h5>
          <p>
            Welcome to Team4stackAds. These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Team4stackAds ("we," "us," or "our"). 
            By accessing, browsing, or using our investment and earning platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.
          </p>

          <h5 className="mt-4">1. Definitions</h5>
          <ul>
            <li><strong>"Platform"</strong> refers to the Team4stackAds website, applications, and services</li>
            <li><strong>"User"</strong> refers to any individual who accesses or uses the platform</li>
            <li><strong>"Tasks"</strong> refers to activities or actions completed by users to earn rewards</li>
            <li><strong>"Investment"</strong> refers to funds deposited by users into the platform</li>
            <li><strong>"Earnings"</strong> refers to rewards, profits, or commissions earned through platform activities</li>
            <li><strong>"Wallet"</strong> refers to the user's account balance within the platform</li>
            <li><strong>"Referral"</strong> refers to users invited to join the platform through your unique referral link</li>
          </ul>

          <h5 className="mt-4">2. Eligibility Requirements</h5>
          <h6 className="mt-3">2.1 Age Requirement</h6>
          <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to use Team4stackAds. By using the platform, you represent and warrant that you meet this age requirement.</p>

          <h6 className="mt-3">2.2 Legal Capacity</h6>
          <p>You must have the legal capacity to enter into binding contracts. This means you are not:</p>
          <ul>
            <li>A minor or under guardianship</li>
            <li>Declared mentally incompetent by a court</li>
            <li>Prohibited from using financial services under applicable laws</li>
          </ul>

          <h6 className="mt-3">2.3 Account Verification</h6>
          <ul>
            <li>You must provide accurate, complete, and current registration information</li>
            <li>You must verify your email address and phone number</li>
            <li>KYC (Know Your Customer) verification may be required for certain features</li>
            <li>You are responsible for maintaining updated account information</li>
          </ul>

          <h5 className="mt-4">3. Account Registration and Security</h5>
          <h6 className="mt-3">3.1 Registration Process</h6>
          <ul>
            <li>Create an account by providing required information (name, email, password)</li>
            <li>Choose a strong, unique password</li>
            <li>Agree to these Terms and Privacy Policy</li>
            <li>Complete email verification</li>
          </ul>

          <h6 className="mt-3">3.2 Account Security</h6>
          <ul>
            <li>You are solely responsible for maintaining confidentiality of your login credentials</li>
            <li>You are responsible for all activities under your account</li>
            <li>Notify us immediately of unauthorized access or security breaches</li>
            <li>We are not liable for losses due to your failure to secure your account</li>
          </ul>

          <h6 className="mt-3">3.3 One Account Policy</h6>
          <p>Each user is limited to one active account. Creating multiple accounts may result in:</p>
          <ul>
            <li>Immediate suspension of all accounts</li>
            <li>Forfeiture of earnings and bonuses</li>
            <li>Permanent ban from the platform</li>
          </ul>

          <h5 className="mt-4">4. Investment Services</h5>
          <h6 className="mt-3">4.1 Making Investments</h6>
          <ul>
            <li>Browse available investment opportunities and tasks</li>
            <li>Select investment amount within specified limits</li>
            <li>Confirm investment terms including duration and expected returns</li>
            <li>Funds will be deducted from your wallet balance</li>
          </ul>

          <h6 className="mt-3">4.2 Investment Risks</h6>
          <p>IMPORTANT: All investments involve risk. You acknowledge and understand that:</p>
          <ul>
            <li>Past performance does not guarantee future results</li>
            <li>Investment values can fluctuate based on market conditions</li>
            <li>You may lose some or all of your invested capital</li>
            <li>Expected returns are estimates, not guarantees</li>
            <li>You should only invest amounts you can afford to lose</li>
            <li>We do not provide personalized investment advice</li>
          </ul>

          <h6 className="mt-3">4.3 Investment Limits</h6>
          <ul>
            <li><strong>Minimum Investment:</strong> $10 USD (or equivalent)</li>
            <li><strong>Maximum Investment:</strong> Varies by plan and user verification level</li>
            <li><strong>Daily Limit:</strong> Maximum $10,000 per day for unverified users</li>
            <li><strong>Increased Limits:</strong> Higher limits available after KYC verification</li>
          </ul>

          <h5 className="mt-4">5. Earning System</h5>
          <h6 className="mt-3">5.1 Types of Earnings</h6>
          <ul>
            <li><strong>Task Completion:</strong> Earn rewards for completing designated tasks</li>
            <li><strong>Investment Returns:</strong> Earn returns based on investment performance</li>
            <li><strong>Referral Commissions:</strong> Earn percentage of referrals' earnings</li>
            <li><strong>Bonuses:</strong> Promotional bonuses, daily login rewards, special campaigns</li>
            <li><strong>Team Commissions:</strong> Earnings from team member activities (if applicable)</li>
          </ul>

          <h6 className="mt-3">5.2 Earning Calculations</h6>
          <ul>
            <li>Earnings are calculated automatically by the platform</li>
            <li>Task earnings credited immediately upon completion</li>
            <li>Investment returns calculated daily/weekly based on plan</li>
            <li>Referral commissions calculated when referrals complete tasks</li>
            <li>All earnings are visible in your transaction history</li>
          </ul>

          <h6 className="mt-3">5.3 Earning Modifications</h6>
          <p>We reserve the right to modify earning rates, structures, or methodologies:</p>
          <ul>
            <li>Changes will be communicated via email or platform notification</li>
            <li>Changes typically take effect within 7 days of notice</li>
            <li>Ongoing investments generally honor original terms until maturity</li>
            <li>New rates apply to new investments and tasks after effective date</li>
          </ul>

          <h5 className="mt-4">6. Withdrawals and Payments</h5>
          <h6 className="mt-3">6.1 Withdrawal Requests</h6>
          <ul>
            <li>Submit withdrawal requests through the Wallet section</li>
            <li>Specify withdrawal amount and payment method</li>
            <li>Ensure minimum withdrawal threshold is met</li>
            <li>Provide accurate payment details (wallet address, bank account, etc.)</li>
          </ul>

          <h6 className="mt-3">6.2 Withdrawal Limits</h6>
          <ul>
            <li><strong>Minimum Withdrawal:</strong> $20 USD (or equivalent)</li>
            <li><strong>Maximum Daily Withdrawal:</strong> $5,000 for verified users; $1,000 for unverified</li>
            <li><strong>Maximum Monthly Withdrawal:</strong> $50,000 for verified users</li>
            <li>Limits may vary based on verification level and payment method</li>
          </ul>

          <h6 className="mt-3">6.3 Processing Times</h6>
          <ul>
            <li><strong>Cryptocurrency:</strong> 24-48 hours</li>
            <li><strong>Bank Transfer:</strong> 3-5 business days</li>
            <li><strong>E-Wallets:</strong> 24-72 hours</li>
            <li><strong>First Withdrawal:</strong> May require additional verification (up to 7 days)</li>
          </ul>

          <h6 className="mt-3">6.4 Withdrawal Fees</h6>
          <ul>
            <li>Cryptocurrency withdrawals: Network gas fees apply</li>
            <li>Bank transfers: $5-$25 depending on destination</li>
            <li>E-Wallets: 1-2% of withdrawal amount</li>
            <li>Premium members may qualify for fee waivers</li>
          </ul>

          <h6 className="mt-3">6.5 Withdrawal Verification</h6>
          <p>For security purposes, we may require:</p>
          <ul>
            <li>Identity verification (government-issued ID)</li>
            <li>Proof of payment method ownership</li>
            <li>Source of funds documentation for large withdrawals</li>
            <li>Additional security questions or verification steps</li>
          </ul>

          <h5 className="mt-4">7. Referral Program</h5>
          <h6 className="mt-3">7.1 Referral Eligibility</h6>
          <ul>
            <li>All users can participate in the referral program</li>
            <li>Each user receives a unique referral link</li>
            <li>Referrals must register through your link to qualify</li>
            <li>You cannot refer yourself through multiple accounts</li>
          </ul>

          <h6 className="mt-3">7.2 Referral Commissions</h6>
          <ul>
            <li><strong>Direct Referrals:</strong> Earn 10% of their task earnings</li>
            <li><strong>Second Level:</strong> Earn 5% of referrals' referrals' earnings (if applicable)</li>
            <li>Commissions paid when referrals complete tasks</li>
            <li>No commission charged to referred users</li>
          </ul>

          <h6 className="mt-3">7.3 Referral Restrictions</h6>
          <p>Prohibited referral practices include:</p>
          <ul>
            <li>Creating fake accounts as your own referral</li>
            <li>Using automated systems to generate referrals</li>
            <li>Misleading or deceptive promotion methods</li>
            <li>Spamming or unsolicited mass messaging</li>
          </ul>
          <p>Violations may result in commission forfeiture and account suspension.</p>

          <h5 className="mt-4">8. User Conduct and Prohibited Activities</h5>
          <h6 className="mt-3">8.1 General Conduct</h6>
          <p>You agree to use the platform in accordance with all applicable laws and regulations. You must not:</p>
          <ul>
            <li>Engage in fraudulent, deceptive, or illegal activities</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Transmit malware, viruses, or harmful code</li>
            <li>Interfere with platform security or functionality</li>
          </ul>

          <h6 className="mt-3">8.2 Prohibited Financial Activities</h6>
          <ul>
            <li>Money laundering or terrorist financing</li>
            <li>Using stolen or fraudulent payment methods</li>
            <li>Chargeback fraud or false dispute claims</li>
            <li>Manipulating investment outcomes or task results</li>
            <li>Insider trading or market manipulation</li>
          </ul>

          <h6 className="mt-3">8.3 Prohibited Technical Activities</h6>
          <ul>
            <li>Using bots, scripts, or automation to complete tasks</li>
            <li>Hacking, probing, or testing platform security</li>
            <li>Accessing other users' accounts without authorization</li>
            <li>Reverse engineering or decompiling platform software</li>
            <li>Overloading or disrupting platform infrastructure</li>
          </ul>

          <h6 className="mt-3">8.4 Intellectual Property</h6>
          <ul>
            <li>You may not copy, modify, or distribute platform content</li>
            <li>Trademarks, logos, and branding are owned by Team4stackAds</li>
            <li>Unauthorized commercial use of platform data is prohibited</li>
            <li>User-generated content remains property of users but grants us license to display</li>
          </ul>

          <h5 className="mt-4">9. Platform Disclaimers and Limitations</h5>
          <h6 className="mt-3">9.1 No Warranties</h6>
          <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
          <ul>
            <li>Warranties of merchantability, fitness for particular purpose</li>
            <li>Warranties of accuracy, completeness, or reliability</li>
            <li>Warranties of uninterrupted, error-free, or secure operation</li>
          </ul>

          <h6 className="mt-3">9.2 Investment Disclaimer</h6>
          <p>TEAM4STACKADS DOES NOT GUARANTEE PROFITS OR SPECIFIC RETURNS. ALL INVESTMENTS CARRY RISK INCLUDING POTENTIAL LOSS OF PRINCIPAL. YOU ARE SOLELY RESPONSIBLE FOR YOUR INVESTMENT DECISIONS.</p>

          <h6 className="mt-3">9.3 Limitation of Liability</h6>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, TEAM4STACKADS SHALL NOT BE LIABLE FOR:</p>
          <ul>
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, business, or goodwill</li>
            <li>Errors, delays, or interruptions in platform operation</li>
            <li>Losses due to market fluctuations or investment performance</li>
            <li>Damages arising from user negligence or misconduct</li>
          </ul>
          <p>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE LAST 6 MONTHS.</p>

          <h6 className="mt-3">9.4 Indemnification</h6>
          <p>You agree to indemnify and hold harmless Team4stackAds from any claims, losses, damages, or expenses arising from your use of the platform, violation of these Terms, or infringement of third-party rights.</p>

          <h5 className="mt-4">10. Account Suspension and Termination</h5>
          <h6 className="mt-3">10.1 Grounds for Suspension</h6>
          <p>We may suspend or restrict your account if we suspect:</p>
          <ul>
            <li>Violation of these Terms and Conditions</li>
            <li>Fraudulent or suspicious activities</li>
            <li>Security breach or unauthorized access</li>
            <li>Request by law enforcement or regulatory authority</li>
          </ul>

          <h6 className="mt-3">10.2 Grounds for Termination</h6>
          <p>We may terminate your account for:</p>
          <ul>
            <li>Material breach of these Terms</li>
            <li>Extended period of inactivity (12+ months)</li>
            <li>Regulatory or legal requirements</li>
            <li>Discontinuation of platform operations</li>
          </ul>

          <h6 className="mt-3">10.3 Effect of Termination</h6>
          <ul>
            <li>Access to platform will be immediately revoked</li>
            <li>Outstanding earnings may be forfeited for cause</li>
            <li>Remaining balance will be returned (minus fees/penalties)</li>
            <li>Ongoing investments may be liquidated at current value</li>
          </ul>

          <h6 className="mt-3">10.4 Appeal Process</h6>
          <p>If your account is suspended or terminated:</p>
          <ul>
            <li>You will receive notification explaining the reason</li>
            <li>You may appeal within 14 days via support@team4stackads.com</li>
            <li>Our team will review and respond within 7 business days</li>
            <li>Decision of review is final</li>
          </ul>

          <h5 className="mt-4">11. Force Majeure</h5>
          <p>Team4stackAds shall not be liable for failures or delays in performance due to causes beyond reasonable control, including but not limited to:</p>
          <ul>
            <li>Natural disasters, acts of God</li>
            <li>War, terrorism, civil unrest</li>
            <li>Government actions, embargoes, sanctions</li>
            <li>Internet outages, cyberattacks</li>
            <li>Power failures, equipment malfunctions</li>
          </ul>

          <h5 className="mt-4">12. Dispute Resolution</h5>
          <h6 className="mt-3">12.1 Informal Resolution</h6>
          <p>Before pursuing formal legal action, you must contact us at legal@team4stackads.com and attempt to resolve disputes informally. We will respond within 14 days.</p>

          <h6 className="mt-3">12.2 Arbitration</h6>
          <p>If informal resolution fails, disputes shall be resolved through binding arbitration in accordance with rules of [Arbitration Association]. Arbitration shall take place in [Your Jurisdiction].</p>

          <h6 className="mt-3">12.3 Class Action Waiver</h6>
          <p>ANY DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS, NOT AS PART OF A CLASS ACTION OR REPRESENTATIVE PROCEEDING. YOU WAIVE THE RIGHT TO PARTICIPATE IN CLASS ACTIONS.</p>

          <h6 className="mt-3">12.4 Governing Law</h6>
          <p>These Terms shall be governed by the laws of [Your Country/State], without regard to conflict of law provisions.</p>

          <h5 className="mt-4">13. Modifications to Terms</h5>
          <p>We reserve the right to modify these Terms at any time:</p>
          <ul>
            <li>Changes will be posted on this page with updated revision date</li>
            <li>Significant changes will be communicated via email or platform notice</li>
            <li>Changes become effective immediately upon posting</li>
            <li>Continued use after changes constitutes acceptance</li>
            <li>If you disagree with changes, discontinue use immediately</li>
          </ul>

          <h5 className="mt-4">14. Severability</h5>
          <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to reflect the original intent while being legally enforceable.</p>

          <h5 className="mt-4">15. Assignment</h5>
          <p>You may not assign or transfer your rights or obligations under these Terms. Team4stackAds may assign its rights and obligations without your consent, including in connection with mergers, acquisitions, or sale of assets.</p>

          <h5 className="mt-4">16. Entire Agreement</h5>
          <p>These Terms, together with our Privacy Policy and other guidelines, constitute the entire agreement between you and Team4stackAds regarding use of the platform, superseding any prior agreements.</p>

          <h5 className="mt-4">17. Contact Information</h5>
          <p>For questions about these Terms & Conditions, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> legal@team4stackads.com</li>
            <li><strong>Support:</strong> support@team4stackads.com</li>
            <li><strong>Address:</strong> [Your Business Address]</li>
          </ul>

          <div className="alert alert-warning mt-4" role="alert">
            <strong>IMPORTANT NOTICE:</strong> These Terms & Conditions are legally binding. Please read carefully before using Team4stackAds. By using the platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Terms
