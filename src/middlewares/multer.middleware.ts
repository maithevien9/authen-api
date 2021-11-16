import multer, { FileFilterCallback } from 'multer';

interface ICallback extends FileFilterCallback {
  (error: null | Error, acceptFile: boolean): void;
}

class MulterMiddleware {
  private static storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  static upload = multer({
    storage: MulterMiddleware.storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter(req, file, cb: ICallback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/gi)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  });
}

export default MulterMiddleware;
