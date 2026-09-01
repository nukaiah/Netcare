import userModel from "../Models/UserModels.js";
import { onboardingTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { comparePassword } from "../Utils/PasswordHash.js";
import { generateJwtToken } from "../Utils/Jwt_Token.js";
import generateOtp from "../Utils/GenerateOtp.js";
import { encrypt } from "../Utils/EncryptDecrypt.js";
import redisClient from "../config/RedisConfig.js";
import emailQueue from "../Ques/EmailQues.js";


const registrationService = async (userData) => {
    const response = await userModel.create(userData);
    const template = onboardingTemplate(response.fullName, response.roleId);
    await emailQueue.add("onboarding-email", {email: response.email,subject: template.subject,html: template.html});
    response.password = undefined;
    return response;
};

const loginService = async (loginCreds) => {
    const { email, password } = loginCreds || {};
    const userData = await userModel.findOne({ email, isDeleted: false }).select("+password").lean();
    if (!userData) {
        return "Not Found";
    }

    if (userData.accountStatus !== "Active") {
        return "Account Suspended/Inactive";
    }
    const isPasswordCorrect = await comparePassword(password, userData.password);
    if (!isPasswordCorrect) {
        return "Password Incorrect";
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
        return "Not Found";
    }

    const [emailOtp,encryptEmail] = await Promise.allSettled([generateOtp(),encrypt(email)]);

    console.log(emailOtp.value);
    console.log(encryptEmail.value);

    const emailKey = `otps:${encryptEmail.value}`;
    const OTP_EXPIRY_SECONDS = 300;
    const emailData = {
        type: "ForgotPassword",
        mode: "Email",
        emailMobile: encryptEmail.value,
        isUsed: false,
        otp: encrypt(emailOtp.value),
        expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
    };

    console.log(emailData);

    await redisClient.json.set(emailKey, "$", emailData);
    await redisClient.expire(emailKey, OTP_EXPIRY_SECONDS);
    const template = forgotPasswordOtpTemplate(emailOtp.value, response.fullName);
    await emailQueue.add("forgotpassword-email", {email: email,subject: template.subject,html: template.html});
    // const emailResponse = await sendEmail(email, template.subject, template.html);
    return true;
};

const resetPassworService = async (resetPasswordData) => {
    const { email, password } = resetPasswordData || {};
    const response = await userModel.findOneAndUpdate({ email }, { $set: { password } });
    if (!response) {
        return "Not Found";
    }
    return response;
};

const updatePasswordService = async (changePasswordData) => {
    const { id, password, newPassword } = changePasswordData || {};
    const response = await userModel.findById(id).select("+password");
    if (!response) {
        return "Not Found";
    }
    const isPasswordCorrect = await comparePassword(password, response.password);
    if (!isPasswordCorrect) {
        return "Password Incorrect";
    }
    response.password = newPassword;
    await response.save();
    return response;
};



export { registrationService, loginService, forgotPasswordService, resetPassworService, updatePasswordService };