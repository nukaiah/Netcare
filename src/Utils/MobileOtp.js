import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();


const sendMobileSmsOtp = async (mobile, otp) => {
    try {
        console.log(otp);
        const response = await axios.post(
            "https://control.msg91.com/api/v5/flow",
            {
                template_id: process.env.template_id,
                recipients: [
                    {
                        mobiles: `91${mobile}`, // Country Code + Mobile
                        var: otp
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    authkey: process.env.authkey
                },
            }
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(
            error.response?.data || error.message
        );
        throw error;
    }
};


export default sendMobileSmsOtp;