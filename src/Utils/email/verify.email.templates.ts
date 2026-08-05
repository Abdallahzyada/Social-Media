export const templet = (code:string, firstName:string, subjcet:string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #2e2e28; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 560px; margin: 48px auto; padding: 0 16px 48px; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e8e4; }
    .header { background: #1a1a1a; padding: 32px; text-align: center; }
    .header-logo { font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px; }
    .header-logo span { color: #a78bfa; }
    .body { padding: 40px 40px 32px; }
    .greeting { font-size: 22px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; }
    .description { font-size: 15px; color: #6b6b67; line-height: 1.6; margin-bottom: 32px; }
    .otp-label { font-size: 12px; font-weight: 500; color: #9b9b97; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .otp-box { background: #f8f7ff; border: 1.5px solid #c4b5fd; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; }
    .otp-code { font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #5b21b6; font-family: 'Courier New', monospace; }
    .expiry-row { display: flex; align-items: center; gap: 8px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; margin-bottom: 28px; }
    .expiry-icon { font-size: 16px; }
    .expiry-text { font-size: 13px; color: #92400e; }
    .divider { border: none; border-top: 1px solid #e8e8e4; margin: 28px 0; }
    .warning { font-size: 13px; color: #9b9b97; line-height: 1.6; }
    .warning strong { color: #6b6b67; font-weight: 500; }
    .footer { padding: 20px 40px 28px; text-align: center; }
    .footer-text { font-size: 12px; color: #b4b4b0; line-height: 1.7; }
    .footer-text a { color: #7c3aed; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-logo">Hnst<span>.</span></div>
      </div>
      <div class="body">
        <p class="greeting">${subjcet}</p>
        <p class="description">
          Hi ${firstName} there! Use the one-time code below to complete your sign-up.
          Don't share this code with anyone.
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
          © 2026 Hnst. All rights reserved.<br/>
          <a href="#">Unsubscribe</a> · <a href="#">Privacy policy</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
