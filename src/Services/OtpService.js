// import OtpModel from "../Models/OTPModel.js";
import UserModels from "../Models/UserModels.js";
import generateOtp from "../Utils/GenerateOtp.js";
import { otpTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { sendEmail } from "../Utils/Email.js";
import sendMobileSmsOtp from "../Utils/MobileOtp.js";
import redisClient from "../config/RedisConfig.js";
import { encrypt, decrypt } from "../Utils/EncryptDecrypt.js";



const saveOtpService = async (otpData) => {
    const { email, mobileNumber } = otpData || {};
    const existingUser = await UserModels.findOne({ $or: [{ "email": email }, { "mobileNumber": mobileNumber }] });
    if (existingUser) {
        throw new Error("Existed User");
    }

    const [emailOtp, mobileOtp, encryptEmail, encryptMobile] = await Promise.all([generateOtp(), generateOtp(), encrypt(email), encrypt(mobileNumber)]);

    const emailKey = `otps:${encryptEmail}`;
    const mobileKey = `otps:${encryptMobile}`;
    const OTP_EXPIRY_SECONDS = 300;

    const emailData = {
        type: "Register",
        mode: "Email",
        emailMobile: encryptEmail,
        isUsed: false,
        otp: encrypt(emailOtp),
        expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
    };
    const mobileData = {
        type: "Register",
        mode: "Mobile",
        emailMobile: encryptMobile,
        isUsed: false,
        otp: encrypt(mobileOtp),
        expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
    };

    const [emailRedis, mobileRedis] = await Promise.all([
        redisClient.json.set(emailKey, "$", emailData),
        redisClient.json.set(mobileKey, "$", mobileData)
    ]);
    const [emailExpire, mobileExpire] = await Promise.all([
        redisClient.expire(emailKey, OTP_EXPIRY_SECONDS),
        redisClient.expire(mobileKey, OTP_EXPIRY_SECONDS),
    ]);
    const template = otpTemplate(emailOtp, email);
    const [emailResponse, mobileResponse] = await Promise.all([sendEmail(email, template.subject, template.html), sendMobileSmsOtp(mobileNumber, mobileOtp)]);
    return true;
};

const verifyOtpService = async (otpData) => {
    const { emailMobile, otp } = otpData || {};
    const encryptData = await encrypt(emailMobile);
    const key = `otps:${encryptData}`;
    const redis = await redisClient.duplicate();
    await redis.connect();
    try {
        await redis.watch(key);
        const response = await redis.json.get(key);

        if (!response) {
            throw new Error("Otp Not Found");
        }
        const decryptOtp = decrypt(response.otp); 
        if (decryptOtp !== otp) {
            throw new Error("Invalid otp");
        }

        const now = new Date();
        const expireDate = new Date(response.expireDate);

        if (expireDate <= now) {
            throw new Error("Expired otp");
        }

        const transaction = redis.multi();

        transaction.json.del(key);

        const result = await transaction.exec();

        if (result === null) {
            throw new Error("Otp Used");
        }

        return true;

    } finally {
        await redis.quit();
    }
};


const resendOtpService = async (resendOtpData) => {
    const { type, emailMobile, mode } = resendOtpData || {};
    const [otp,encryptData] = await Promise.all([generateOtp(),encrypt(emailMobile)]);
    const key = `otps:${encryptData}`;
    const OTP_EXPIRY_SECONDS = 300;
    const otpData = {
        emailMobile: encryptData,
        isUsed: false,
        otp: encrypt(otp),
        expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
    };
    await redisClient.json.set(key, "$", otpData);
    await redisClient.expire(key, OTP_EXPIRY_SECONDS);
    if (mode === "Email") {
        let template;
        if (type === "ForgotPassword") {
            template = forgotPasswordOtpTemplate(otp, emailMobile);
        }
        if (type === "Register") {
            template = otpTemplate(otp, emailMobile);
        }
        await sendEmail(emailMobile, template.subject, template.html);
    }
    if (mode === "Mobile") {
        await sendMobileSmsOtp(
            emailMobile,
            otp
        );
    }
    return true;
};


export { saveOtpService, verifyOtpService, resendOtpService };