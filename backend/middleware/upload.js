const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        '.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif', '.gif', '.bmp', '.tiff', '.tif',
        '.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v', '.wmv', '.3gp',
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${ext} not allowed. Images: jpg, png, heic, gif, etc. Videos: mp4, mov, webm, etc.`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 },
});

module.exports = upload;
