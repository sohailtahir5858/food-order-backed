
export const generateOtp = async () => {
    const otp = Math.floor(Math.random() * (111111 - 999999 + 1)) + 999999;
    const otp_expiry = new Date();
    otp_expiry.setMinutes(otp_expiry.getMinutes() + 30);
    return { otp, otp_expiry }
}

export const onRequestOtp = async (otp: number, phoneNumber: number | string) => {
    const accountSid = process.env.TWILIO_ACC_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(accountSid, authToken);

    const result = await client.messages
        .create({
            from: process.env.TWILIO_DEF_NUMBER,
            to: `+92${phoneNumber}`,
            body: `Your otp is ${otp}`
        });
    return result.sid ? true : false;
    // if (result.sid) {
    //     console.log('Message sent successfully:', result.sid);
    // } else {
    //     console.log('Message failed to send');
    // }
}