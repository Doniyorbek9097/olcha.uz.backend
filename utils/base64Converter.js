const fs = require("fs");
const path = require("path");
const { generateOTP } = require('./otpGenrater');
const resizeImage = require("./resizeImage");

exports.base64Converter = function (req, base64) {
    const uploadFolder = path.join(__dirname, "../uploads");

    if(Array.isArray(base64) && base64 !== null) {
        const filePaths = [];
        const urls = [];
        for (const file of base64) {
        if(typeof file !== 'string' || !file.includes("base64")) return;
            const filename = `image-${generateOTP(10)}.png`;
            const filePath = path.join(__dirname, "../uploads", filename)
            const matches = file.toString().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
            filePaths.push(resizeImage(req, filePath));
        }

        return  filePaths;
    }

    if(typeof base64 !== 'string' || base64.includes("base64") == false) return;
    const filename = `image-${generateOTP(10)}.png`;
    const filePath = path.join(__dirname, "../uploads", filename)
    const base64Index = base64.indexOf(';base64,') + ';base64,'.length;
    const base64Image = base64.substring(base64Index)
    if(base64Index !== 7)
    fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'))
    return  resizeImage(req, filePath);   


}