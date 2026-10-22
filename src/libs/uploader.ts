import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import Errors, { HTTPCode, Message } from "./Errors";
import { UPLOAD_MAX_BYTES } from "./config";

/** Only raster images. SVG/HTML are rejected: they can carry scripts (stored XSS). */
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/** MULTER UPLOADER CONFIGURATION **/
function getTargetImageStore(address: string) {
  const dir = path.resolve("public/uploads", address);
  fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, `./public/uploads/${address}`),
    // The extension is derived from the validated MIME type, never from the client filename
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}_${crypto.randomBytes(8).toString("hex")}${ALLOWED_MIME[file.mimetype]}`),
  });
}

const makeUploader = (address: string) =>
  multer({
    storage: getTargetImageStore(address),
    limits: { fileSize: UPLOAD_MAX_BYTES, files: 5 },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME[file.mimetype]) cb(null, true);
      else cb(new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_FILE));
    },
  });

export default makeUploader;
