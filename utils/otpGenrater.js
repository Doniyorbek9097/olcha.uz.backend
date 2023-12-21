const otpGenrator = require("otp-generator")
exports.generateOTP = () => {
    return otpGenrator.generate(4, {
        upperCaseAlphabets:false,
        specialChars:false,
        lowerCaseAlphabets:false,
    })
}