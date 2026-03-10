"use strict";

/**
 * HTML Email Template cho OTP Verification
 * Dùng placeholder {{$otp_token}} — sẽ được thay thế bằng replacePlaceholder()
 */
const htmlEmailToken = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #f0f4f8;
                padding: 40px 20px;
            }

            .email-wrapper {
                max-width: 560px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            }

            /* ── Header ── */
            .email-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
            }

            .email-header .logo {
                font-size: 28px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 1px;
            }

            .email-header .logo span {
                color: #ffd700;
            }

            .email-header p {
                color: rgba(255,255,255,0.85);
                font-size: 14px;
                margin-top: 6px;
            }

            /* ── Body ── */
            .email-body {
                padding: 40px 36px;
            }

            .email-body h2 {
                font-size: 22px;
                color: #1a1a2e;
                margin-bottom: 12px;
            }

            .email-body p {
                font-size: 15px;
                color: #555770;
                line-height: 1.7;
                margin-bottom: 16px;
            }

            /* ── OTP Box ── */
            .otp-box {
                background: #f5f3ff;
                border: 2px dashed #764ba2;
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin: 28px 0;
            }

            .otp-box .otp-label {
                font-size: 13px;
                color: #764ba2;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 600;
                margin-bottom: 10px;
            }

            .otp-box .otp-code {
                font-size: 42px;
                font-weight: 800;
                color: #3d2c8d;
                letter-spacing: 10px;
                font-family: 'Courier New', monospace;
            }

            /* ── Warning ── */
            .warning-box {
                background: #fff8e1;
                border-left: 4px solid #ffc107;
                border-radius: 6px;
                padding: 14px 18px;
                margin-top: 10px;
            }

            .warning-box p {
                font-size: 13px;
                color: #7a6000;
                margin: 0;
            }

            /* ── Footer ── */
            .email-footer {
                background: #f8f9fc;
                padding: 24px 36px;
                text-align: center;
                border-top: 1px solid #e8eaf0;
            }

            .email-footer p {
                font-size: 12px;
                color: #9ea3b8;
                line-height: 1.6;
            }

            .email-footer a {
                color: #667eea;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">

            <!-- Header -->
            <div class="email-header">
                <div class="logo">Shop<span>Zone</span></div>
                <p>Your trusted e-commerce platform</p>
            </div>

            <!-- Body -->
            <div class="email-body">
                <h2>👋 Verify Your Email Address</h2>
                <p>
                    Thanks for signing up! To complete your registration, please use
                    the one-time verification token below. It is valid for
                    <strong>60 seconds</strong>.
                </p>

                <!-- OTP Display - placeholder sẽ được replace bởi replacePlaceholder() -->
                <div class="otp-box">
                    <div class="otp-label">Your Verification Token</div>
                    <div class="otp-code">{{$otp_token}}</div>
                </div>

                <!-- Warning -->
                <div class="warning-box">
                    <p>
                        ⚠️ <strong>Security notice:</strong> Never share this code with anyone.
                        Our team will never ask for it. If you did not request this,
                        please ignore this email.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>
                    © 2026 ShopZone. All rights reserved.<br/>
                    You're receiving this email because you signed up at
                    <a href="#">shopzone.com</a>.<br/>
                    If this wasn't you, please <a href="#">contact support</a>.
                </p>
            </div>

        </div>
    </body>
    </html>
    `;
};

module.exports = { htmlEmailToken };
