import multer from "multer";
import { multerFileFilter } from "../utility/fileValidator.utility.js";

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,

    }
})

export default upload