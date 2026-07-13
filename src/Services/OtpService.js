import OtpModel from "../Models/OTPModel.js";
import UserModels from "../Models/UserModels.js";
import generateOtp from "../Utils/GenerateOtp.js";
import { otpTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { sendEmail } from "../Utils/Email.js";

const saveOtpService = async (otpData) => {
    const { email, mobileNumber } = otpData || {};
    const existingUser = await UserModels.findOne({ $or: [{ "email": email }, { "mobileNumber": mobileNumber }] });
    if (existingUser) {
        return "Existed User";
    }
    await OtpModel.deleteMany({
        $or: [
            { emailMobile: email, type: "Register", isUsed: false },
            { emailMobile: mobileNumber, type: "Register", isUsed: false }
        ]
    });
    const emailOtp = await generateOtp();
    const mobileOtp = "123456";
    console.log(emailOtp);
    console.log(mobileOtp);
    const emailData = {
        type: "Register",
        mode: "Email",
        emailMobile: email,
        otp: emailOtp.toString(),
        expireDate: new Date(Date.now() + 5 * 60 * 1000),
    };
    const mobileData = {
        type: "Register",
        mode: "Mobile",
        emailMobile: mobileNumber,
        otp: mobileOtp,
        expireDate: new Date(Date.now() + 5 * 60 * 1000),
    };
    const data = [emailData, mobileData];
    const response = await OtpModel.insertMany(data);
    const template = otpTemplate(emailOtp, email);
    const emailResponse = await sendEmail(email, template.subject, template.html);
    if (emailResponse === "error") {
        return "Email Failed";
    }

    return existingUser;
};


const verifyOtpService = async (otpData) => {
    const now = new Date();
    const response = await OtpModel.findOneAndUpdate(
        {
            ...otpData,
            isUsed: false,
            expireDate: { $gt: now }
        },
        { $set: { isUsed: true } },
        { sort: { createdAt: -1 }, new: true }
    );
    if (response) {
        return response
    };

    if (!response) {
        const check = await OtpModel.findOne(otpData).sort({ createdAt: -1 });
        if (!check) {
            return "Invalid";
        }
        if (check.isUsed) {
            return "Used";
        }
        if (check.expireDate < now) {
            return "Expired"
        }
    }
};

const resendOtpService = async (resendOtpData) => {
    const { type, emailMobile, mode } = resendOtpData || {};
    await OtpModel.deleteMany({ emailMobile, type, mode, isUsed: false });

    const otp = await generateOtp();

    const otpData = {
        type: type,
        mode: mode,
        emailMobile: emailMobile,
        otp: mode === "Email" ? otp : "123456",
        expireDate: new Date(Date.now() + 10 * 60 * 1000),
    };
    console.log(otp);

    const response = await OtpModel.create(otpData);

    if (mode === "Email") {
        let template;
        if (type === "ForgotPassword") {
            template = forgotPasswordOtpTemplate(otp, emailMobile);
        }
        if (type === "Register") {
            template = otpTemplate(otp, emailMobile);
        }
        const emailResponse = await sendEmail(emailMobile, template.subject, template.html);
        if (emailResponse === "error") {
            return "Email Failed";
        }
    }
    if (mode === "Mobile") {
        // SMS provider here
    }
    return response;
};


export { saveOtpService, verifyOtpService, resendOtpService };