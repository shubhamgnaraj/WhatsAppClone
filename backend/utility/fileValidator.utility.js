const allowTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm"
]

export const isAllowedType = (mimeType) => {
    return allowTypes.includes(mimeType)
}


export const multerFileFilter = (req, file, cb) => {
    if (isAllowedType(file.mimetype)) cb(null, true);

    else cb(new Error("Invalid file Type!"), false);
}