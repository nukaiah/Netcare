import { stat } from "fs";

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
          <strong>ShiftMatch Support Team</strong>
        </p>

      </div>
    </div>
    `
  };
};

const verificationStatusTemplate = (status, facilityName = "Facility Admin") => {

  const isVerified = status === "Verified";
  const statusColor = isVerified ? "#27ae60" : "#e74c3c";
  const bgColor = isVerified ? "#e6f7f1" : "#fdecea";

  return {
    subject: `Account ${status} Notification for ${facilityName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Account ${status}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 10px;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#2c3e50; padding:30px 20px;">
            <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:600;">
              Account ${status}
            </h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:35px 25px;">

            <p style="font-size:16px; color:#333333; margin-top:0;">
              Hello ${facilityName},
            </p>

            <p style="font-size:15px; color:#555555; line-height:1.6;">
              Your account for <strong>${facilityName}</strong> has been 
              <span style="color:${statusColor}; font-weight:600;">${status}</span>.
            </p>

            <!-- Status Info Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; background:${bgColor}; border-radius:8px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0; font-size:14px; color:#555555; line-height:1.6;">
                    ${
                      isVerified
                        ? "Your account is now fully verified. You may access all platform features and begin managing your facility dashboard."
                        : "Unfortunately, your verification request was not approved at this time. Please contact our support team for further clarification."
                    }
                  </p>
                </td>
              </tr>
            </table>

            ${
              isVerified
                ? `
                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                  <tr>
                    <td align="center">
                      <a href="https://shiftmatch.bluhealthapp.com/" 
                         style="background-color:#27ae60; color:#ffffff; padding:14px 30px; 
                                text-decoration:none; font-size:15px; font-weight:600; 
                                border-radius:6px; display:inline-block;">
                        Login to Your Account
                      </a>
                    </td>
                  </tr>
                </table>
                `
                : ""
            }

            <p style="font-size:14px; color:#555555; line-height:1.6;">
              If you have any questions or require assistance, please reach out to our support team.
            </p>

            <p style="font-size:14px; color:#333333; margin-top:25px;">
              Regards,<br/>
              <strong>ShiftMatch Support Team</strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background:#f1f3f6; padding:18px;">
            <p style="font-size:12px; color:#888888; margin:0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`
  };
};

const onboardingTemplate = (
  facilityName = "Facility Admin",
  email,
  temporaryPassword,
  roleId
) => {

  return {
    subject: `Welcome to ShiftMatch – Account Activated`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Welcome to ShiftMatch</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 10px;">
    <tr>
      <td align="center">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1f2d3d; padding:30px 20px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:600;">
                Welcome to ShiftMatch
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 30px;">
              
              <p style="font-size:16px; color:#333333; margin-top:0;">
                Dear ${facilityName},
              </p>

              <p style="font-size:15px; color:#555555; line-height:1.6;">
                We are pleased to inform you that your account has been successfully onboarded to the ShiftMatch platform.
              </p>

              ${
                roleId===1
                ? `
                <!-- Credentials Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; background:#f7f9fc; border:1px solid #e3e8ee; border-radius:8px;">
                  <tr>
                    <td style="padding:20px;">
                      <p style="margin:0 0 10px 0; font-size:14px; color:#666;">Login Credentials</p>
                      
                      <p style="margin:6px 0; font-size:15px; color:#333;">
                        <strong>Email:</strong> ${email}
                      </p>
                      
                      <p style="margin:6px 0; font-size:15px; color:#333;">
                        <strong>Temporary Password:</strong> ${temporaryPassword}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Security Notice -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:25px; background:#fff8e6; border:1px solid #f2d9a6; border-radius:8px;">
                  <tr>
                    <td style="padding:18px;">
                      <p style="margin:0; font-size:14px; color:#555555; line-height:1.6;">
                        For security purposes, you are required to change your password immediately after your first login.
                      </p>
                    </td>
                  </tr>
                </table>
                `
                : `
                <p style="font-size:15px; color:#555555; line-height:1.6; margin-top:20px;">
                  You can access your account using your registered email address and password.
                </p>
                `
              }

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center">
                    <a href="https://shiftmatch.bluhealthapp.com/" 
                       style="background-color:#1f2d3d; color:#ffffff; padding:14px 32px; text-decoration:none; 
                              font-size:15px; font-weight:600; border-radius:6px; display:inline-block;">
                      Access Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; color:#555555; line-height:1.6;">
                If you require assistance, please contact the ShiftMatch support team.
              </p>

              <p style="font-size:14px; color:#333333; margin-top:25px;">
                Sincerely,<br/>
                <strong>ShiftMatch Support Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f1f3f6; padding:18px;">
              <p style="font-size:12px; color:#888888; margin:0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
  };
};

const documentRejectedTemplate = (
  facilityName,
  documentName,
  rejectionReason
) => {
  return {
    subject: `Document Rejected – ${documentName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Document Rejected</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 10px;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#2c3e50; padding:28px 20px;">
            <h2 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
              Document Rejected
            </h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:35px 25px;">

            <p style="font-size:15px; color:#333; margin-top:0;">
              Hello ${facilityName},
            </p>

            <p style="font-size:14px; color:#555; line-height:1.6;">
              We reviewed your submitted document and unfortunately it could not be approved.
            </p>

            <!-- Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; background:#fdecea; border-radius:6px;">
              <tr>
                <td style="padding:18px;">

                  <p style="margin:0; font-size:14px; color:#333;">
                    <strong>Document Name:</strong><br/>
                    ${documentName}
                  </p>

                  <p style="margin-top:15px; font-size:14px; color:#333;">
                    <strong>Reason for Rejection:</strong><br/>
                    ${rejectionReason}
                  </p>

                </td>
              </tr>
            </table>

            <p style="font-size:14px; color:#555; line-height:1.6;">
              Please review the above reason and upload the corrected document from your dashboard.
            </p>

            <p style="font-size:14px; color:#333; margin-top:25px;">
              Regards,<br/>
              <strong>ShiftMatch Support Team</strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background:#f1f3f6; padding:16px;">
            <p style="font-size:12px; color:#888; margin:0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`
  };
};


export { otpTemplate, verificationStatusTemplate, onboardingTemplate,documentRejectedTemplate };