const otpTemplate = (otp, userName = "User") => {
  return {
    subject: "Your OTP for Account Verification",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <h2 style="text-align: center; color: #2c3e50;">
          🔐 Verification Code
        </h2>

        <p style="font-size: 15px; color: #333;">
          Hello ${userName},
        </p>

        <p style="font-size: 15px; color: #333;">
          Your One-Time Password (OTP) is:
        </p>

        <div style="text-align: center; margin: 25px 0;">
          <span style="
            display: inline-block;
            padding: 15px 25px;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 6px;
            background-color: #e8f6f3;
            color: #1abc9c;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555;">
          ⏳ This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="font-size: 14px; color: #e74c3c;">
          ⚠️ Do not share this OTP with anyone.
        </p>

        <hr style="margin: 25px 0;" />

        <p style="font-size: 12px; color: #888;">
          If you did not request this, please ignore this email.
        </p>

        <p style="font-size: 14px; color: #333;">
          Regards,<br/>
          <strong>Healthcare Support Team</strong>
        </p>

      </div>
    </div>
    `
  };
};

export default otpTemplate;