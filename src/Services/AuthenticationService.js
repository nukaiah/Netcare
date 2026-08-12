import userModel from "../Models/UserModels.js";
import { onboardingTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { sendEmail } from "../Utils/Email.js";
import { comparePassword, hashPassword } from "../Utils/PasswordHash.js";
import { generateJwtToken } from "../Utils/Jwt_Token.js";
import generateOtp from "../Utils/GenerateOtp.js";
import { encrypt } from "../Utils/EncryptDecrypt.js";
import redisClient from "../config/RedisConfig.js";


const registrationService = async (userData) => {
    const response = await userModel.create(userData);

    const fullName = response.fullName;
    const email = response.email;
    const roleId = response.roleId;

    const template = onboardingTemplate(fullName, "", "", roleId);
    const emailResponse = await sendEmail(email, template.subject, template.html);


    if (emailResponse === "error") {
        return "Email Failed";
    }
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

    const [emailOtp,encryptEmail] = await Promise.all([
        generateOtp(),
        encrypt(email),
    ]);

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
    const emailResponse = await sendEmail(email, template.subject, template.html);
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

const inserMutipleUsersService = async (userData) => {
    const response = await userModel.insertMany(userData);
    return response;
};

const getAllUsersService = async () => {
    const response = await userModel.find({ roleId: 2 }).collation({ locale: "en", strength: 2 }).sort({ fullName: 1 }).lean();
    return response;
};

export { registrationService, loginService, forgotPasswordService, resetPassworService, updatePasswordService, inserMutipleUsersService, getAllUsersService };