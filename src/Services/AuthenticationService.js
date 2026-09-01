import userModel from "../Models/UserModels.js";
import { onboardingTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { comparePassword } from "../Utils/PasswordHash.js";
import { generateJwtToken } from "../Utils/Jwt_Token.js";
import generateOtp from "../Utils/GenerateOtp.js";
import { encrypt } from "../Utils/EncryptDecrypt.js";
import redisClient from "../config/RedisConfig.js";
import emailQueue from "../Ques/EmailQues.js";
import { sendEmail } from "../Utils/Email.js";


const registrationService = async (userData) => {
    const response = await userModel.create(userData);
    const template = onboardingTemplate(response.fullName, response.roleId);
    await sendEmail(response.email,template.subject,template.html);
    // await emailQueue.add("onboarding-email", {email: response.email,subject: template.subject,html: template.html});
    response.password = undefined;
    return response;
};


const loginService = async (loginCreds) => {
    const { email, password } = loginCreds || {};
    const userData = await userModel.findOne({ email, isDeleted: false }).select("+password").lean();
    if (!userData) {
        throw new Error("Not Found");
    }

    if (userData.accountStatus !== "Active") {
        throw new Error("Account Suspended/Inactive");
    }
    const isPasswordCorrect = await comparePassword(password, userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Password Incorrect");
    }
    userData.password = undefined;

    const token = generateJwtToken(userData._id, userData.roleId);
    const responseWithToken = { userData, token };
    return responseWithToken;
};


const forgotPasswordService = async (forgotPasswordData) => {
    const { email } = forgotPasswordData || {};
    const response = await userModel.findOne({ email }).lean();
    if (!response) {
        throw new Error("Not Found");
    }
    const [emailOtp,encryptEmail] = await Promise.all([generateOtp(),encrypt(email)]);
    const emailKey = `otps:${encryptEmail}`;
    const OTP_EXPIRY_SECONDS = 300;
    const emailData = {
        type: "ForgotPassword",
        mode: "Email",
        emailMobile: encryptEmail,
        isUsed: false,
        otp: encrypt(emailOtp),
        expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
    };
    await redisClient.json.set(emailKey, "$", emailData);
    await redisClient.expire(emailKey, OTP_EXPIRY_SECONDS);
    const template = forgotPasswordOtpTemplate(emailOtp, response.fullName);
    // await emailQueue.add("forgotpassword-email", {email: email,subject: template.subject,html: template.html});
    const emailResponse = await sendEmail(email, template.subject, template.html);
    console.log(emailResponse);
    return true;
};


const resetPassworService = async (resetPasswordData) => {
    const { email, password } = resetPasswordData || {};
    const response = await userModel.findOneAndUpdate({ email }, { $set: { password } });
    if (!response) {
        throw new Error("Not Found");
    }
    return response;
};


const updatePasswordService = async (changePasswordData) => {
    const { id, password, newPassword } = changePasswordData || {};
    const response = await userModel.findById(id).select("+password");
    if (!response) {
        throw new Error("Not Found");
    }
    const isPasswordCorrect = await comparePassword(password, response.password);
    if (!isPasswordCorrect) {
        throw new Error("Password Incorrect");
    }
    response.password = newPassword;
    await response.save();
    return response;
};


export { registrationService, loginService, forgotPasswordService, resetPassworService, updatePasswordService };