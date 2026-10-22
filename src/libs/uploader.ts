import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import Errors, { HTTPCode, Message } from "./Errors";
import { UPLOAD_MAX_BYTES, env } from "./config";

/** Only raster images. SVG/HTML are rejected: they can carry scripts (stored XSS). */
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/**
 * Stored path format kept in the DB: "public/uploads/<folder>/<file>".
 * It is independent of where files physically live (env.uploadDir), so the upload
 * directory can move (e.g. to a Railway Volume) without migrating data.
 */
const STORED_PREFIX = "public/uploads/";
const STORED_PATH = /^public\/uploads\/(members|products)\/[\w.-]+$/;

export const storedPath = (file: Express.Multer.File) =>
  STORED_PREFIX + path.relative(env.uploadDir, file.path).split(path.sep).join("/");

/** Absolute file location for a stored path, or null if it isn't one of our uploads */
export const resolveStoredPath = (stored: string): string | null =>
  STORED_PATH.test(stored) ? path.join(env.uploadDir, stored.slice(STORED_PREFIX.length)) : null;

/** MULTER UPLOADER CONFIGURATION **/
function getTargetImageStore(folder: string) {
  const dir = path.join(env.uploadDir, folder);
  fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    // The extension is derived from the validated MIME type, never from the client filename
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}_${crypto.randomBytes(8).toString("hex")}${ALLOWED_MIME[file.mimetype]}`),
  });
}

const makeUploader = (folder: "members" | "products") =>
  multer({
    storage: getTargetImageStore(folder),
    limits: { fileSize: UPLOAD_MAX_BYTES, files: 5 },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME[file.mimetype]) cb(null, true);
      else cb(new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_FILE));
    },
  });

export default makeUploader;
