import { UploadedFile } from 'express-fileupload';
import { ExpressValidator, validationResult } from 'express-validator';
import httpStatus from 'http-status';

export const validationCustom = new ExpressValidator({
  notFileEmpty: (_: any, { req }) => (!req.files || Object.keys(req.files).length === 0 || !req.files.sampleFile ? false : true),
  isNotImage: (_: any, { req }) => {
    if (!req.files) {
      return false;
    }
    let isImage = true;
    Object.keys(req.files).forEach((key) => {
      const file = req.files[key] as UploadedFile;
      if (!file.mimetype.startsWith('image/')) {
        isImage = false;
      }
    });
    return isImage;
  },
});

import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
};
