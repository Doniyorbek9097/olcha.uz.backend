const path = require("path")
const fs = require("fs")
const url = require("url");
const sharp = require("sharp");
const { generateOTP } = require("./otpGenrater");

module.exports = resizeImage = (filePath) => {
    if(Array.isArray(filePath) && filePath !== null) {
        const files = [];
        for (const filepath of filePath) {
                const fileName = `image-${generateOTP(7)}.webp`;
                const newFilePath = path.join(path.dirname(filepath), fileName);
                sharp(filepath)
                    .resize({ fit: "outside", width: 500, height: 800 })
                    .webp()
                    .toFile(newFilePath, async (err, info) => {
                        if (err) {
                            return console.log(err)
                        } else {
                            fs.unlink(filepath, (err) => {
                                if(err) console.log(err);
                            })
                        }
        
                       
                    })

                    files.push(`http://localhost:5000/uploads/${fileName}`)
                 }

                 return files
    }

        const fileName = `image-${generateOTP(7)}.png`;

        const newFilePath = path.join(path.dirname(filePath), fileName);
        sharp(filePath)
            .resize({ fit: "outside", width: 500, height: 800 })
            .png()
            .toFile(newFilePath, async (err, info) => {
                if (err) {
                    return console.log(err)
                } else {
                    fs.unlink(filePath, (err) => {
                        if(err) console.log(err);
                    })
                } 
                
            })

            return `http://localhost:5000/uploads/${fileName}`;
}