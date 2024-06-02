const { 
    getUserByEmail,
    getUserByEmailAndUserId,
    checkOTPByUserId,
    checkOTPByUserIdAndOTP,
    updateResetPassword,
    updateUserPassword,
    createOTP,
} = require('../repositories/reset_password_repository');
const uuid = require('uuid');
const { hashOtp } = require('../utils/crypto_hash');
const { sendOTPToEmail } = require('../utils/email_transporter');
const { hash } = require('../utils/hash_compare');

require('dotenv').config()

// time variable
const currentMillis = Date.now();
const minuteExpired = process.env.OTP_EXPIRED // in minute

const checkUserEmailService = async(payload) => {
    try {
        const user = await getUserByEmail(payload.email);

        return {user};
    } catch (error) {
        throw error;
    }
};

const sendOTPService = async (payload) => {
    try {
        // create otp
        const otpNumber = Math.floor(100000 + Math.random() * 9000)
        const otp = hashOtp(otpNumber);
        const expiredAt = currentMillis + (minuteExpired * 60000);
        const id = "RP-" + uuid.v4();
        const data = {
            id,
            user_id: payload.user_id,
            otp,
            created_at: currentMillis,
            expired_at: expiredAt
        };

        const userOTPData = await checkOTPByUserId(payload.user_id);
        if (!userOTPData || userOTPData.length === 0) {
            await createOTP(data);
        } else {
            await updateResetPassword(data)
        }

        // send email smtp
        const username = payload.username[0].toUpperCase() + payload.username.slice(1);
        await sendOTPToEmail(payload.email, otpNumber, username);

        return;
    } catch (error) {
        throw error;
    }
};

const updatePasswordService = async (payload) => {
    // check user
    await getUserByEmailAndUserId(payload.user_id, payload.email);

    // check otp
    const otp = hashOtp(payload.otp);
    await checkOTPByUserIdAndOTP(payload.user_id, otp);

    // update password
    payload['id'] = payload.user_id;
    payload['password'] = await hash(payload.password);
    await updateUserPassword(payload);

    return
};


module.exports = {
    checkUserEmailService,
    sendOTPService,
    updatePasswordService,
};