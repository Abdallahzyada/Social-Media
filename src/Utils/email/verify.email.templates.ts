export const templet = (code: string, firstName: string, subjcet: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email — JobLinker</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 560px; margin: 48px auto; padding: 0 16px 48px; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 36px 32px; text-align: center; }
    .header-icon { font-size: 32px; margin-bottom: 8px; }
    .header-logo { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
    .header-logo span { color: #38bdf8; }
    .header-tagline { font-size: 13px; color: #94a3b8; margin-top: 4px; letter-spacing: 0.5px; }
    .body { padding: 40px 40px 32px; }
    .greeting { font-size: 22px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .description { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 32px; }
    .otp-label { font-size: 12px; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .otp-box { background: #f0f9ff; border: 1.5px solid #7dd3fc; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; }
    .otp-code { font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #0369a1; font-family: 'Courier New', monospace; }
    .expiry-row { display: flex; align-items: center; gap: 8px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; margin-bottom: 28px; }
    .expiry-icon { font-size: 16px; }
    .expiry-text { font-size: 13px; color: #92400e; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
    .warning { font-size: 13px; color: #94a3b8; line-height: 1.6; }
    .warning strong { color: #64748b; font-weight: 500; }
    .footer { padding: 20px 40px 28px; text-align: center; }
    .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.7; }
    .footer-text a { color: #0284c7; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-icon">💼</div>
        <div class="header-logo">Job<span>Linker</span></div>
        <div class="header-tagline">Your next career move starts here</div>
      </div>
      <div class="body">
        <p class="greeting">${subjcet}</p>
        <p class="description">
          Hi ${firstName}! Use the one-time code below to verify your account
          and start exploring thousands of job opportunities. Don't share this code with anyone.
        </p>
        <p class="otp-label">Your verification code</p>
        <div class="otp-box">
          <div class="otp-code">${code}</div>
        </div>
        <div class="expiry-row">
          <span class="expiry-icon">⏱</span>
          <span class="expiry-text">This code expires in <strong>2 minutes</strong>.</span>
        </div>
        <hr class="divider" />
        <p class="warning">
          <strong>Didn't request this?</strong> You can safely ignore this email.
          Someone may have entered your address by mistake.
        </p>
      </div>
      <div class="footer">
        <p class="footer-text">
          © 2026 JobLinker. All rights reserved.<br/>
          <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a> · <a href="#">Help Center</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
