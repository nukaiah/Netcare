import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();


const sendMobileSmsOtp = async (mobile, otp) => {
    try {
        const response = await axios.post(
            "https://control.msg91.com/api/v5/flow",
            {
                template_id: process.env.template_id,
                recipients: [
                    {
                        mobiles: `27${mobile}`, // Country Code + Mobile
                        OTP: otp,
                    },
                ],
            },
            {
                headers: {
                    authkey: process.env.authkey,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            error.response?.data || error.message
        );
        throw error;
    }
};


export default sendMobileSmsOtp;