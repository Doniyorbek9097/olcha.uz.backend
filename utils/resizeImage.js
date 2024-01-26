const path = require("path")
const fs = require("fs")
const { generateOTP } = require("./otpGenrater");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = resizeImage = (req, filePath, w=500, h=700) => {
    if(!fs.existsSync(filePath)) return;
    if (Array.isArray(filePath) && filePath !== null) {
        const files = [];
        for (const filepath of filePath) {
            const fileName = `image-${generateOTP(7)}.webp`;
            const newFilePath = path.join(path.dirname(filepath), fileName);

            ffmpeg()
                .input(filepath)
                .outputOptions([`-vf scale=${w}:${h}`])
                .toFormat('webp')
                .on('end', () => {
                    fs.unlink(filePath, (err) => {
                        if (err) console.log(err);
                    })
                })
                .save(newFilePath)


            files.push(`${req.protocol}://${req.headers.host}/uploads/${fileName}`)
        }

        return files
    }

    const fileName = `image-${generateOTP(7)}.webp`;

    const newFilePath = path.join(path.dirname(filePath), fileName);
    ffmpeg()
    .input(filePath)
    .outputOptions([`-vf scale=${w}:${h}`])
    .toFormat('webp')
    .on('end', () => {
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        })
    })
    .save(newFilePath)
    
    return `${req.protocol}://${req.headers.host}/uploads/${fileName}`;
}