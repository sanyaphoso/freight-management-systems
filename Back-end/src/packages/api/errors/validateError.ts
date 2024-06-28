import { CustomError } from './customerError';

const validateError = (error: any) => {
  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.statusCode,
    };
  } else {
    return {
      message: error.message,
      code: 500,
    };
  }
};

export default validateError;
