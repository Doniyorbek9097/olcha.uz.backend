const fs = require("fs");
const path = require("path");

const { generateOTP } = require('./otpGenrater');
exports.base64Converter = function (req, base64) {
    if(Array.isArray(base64) && base64 !== null) {
        const filePaths = [];
        const urls = [];
        for (const file of base64) {
        if(typeof file !== 'string' || !file.includes("base64")) return;
            const filename = `image-${generateOTP()}.png`;
            const filePath = path.join(__dirname, "../uploads", filename)
            const matches = file.toString().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'))
            filePaths.push(filePath);
            urls.push(`${req.protocol}://${req.headers.host}/uploads/${filename}`)
        }
        return  {
            path: filePaths,
            url: urls
        };
    }

    if(typeof base64 !== 'string' || base64.includes("base64") == false) return;
    const filename = `image-${generateOTP()}.png`;
    const filePath = path.join(__dirname, "../uploads", filename)
    const base64Index = base64.indexOf(';base64,') + ';base64,'.length;
    const base64Image = base64.substring(base64Index)
    if(base64Index !== 7)
    fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'))
    return  {
        path: filePath,
        url: `${req.protocol}://${req.headers.host}/uploads/${filename}`
    };
}