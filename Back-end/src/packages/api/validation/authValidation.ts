import { validationCustom } from '.';

export const loginValidation = validationCustom.checkSchema({
  username: {
    errorMessage: 'Username not empty',
    notEmpty: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
  },
});

export const registerValidation = validationCustom.checkSchema({
  upload_image: {
    isNotImage: {
      errorMessage: 'upload_image is not image type or empty',
    },
  },
  full_name: {
    notEmpty: {
      errorMessage: 'Full name not empty',
    },
  },
  username: {
    notEmpty: {
      errorMessage: 'Username not empty',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'password not empty',
    },
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: 'Password should be at least 8 chars',
    },
  },
});
