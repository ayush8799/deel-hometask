const ErrorBuilder = (errorMessage) => {
  let errorResponseObj = {message: errorMessage};
    switch (errorMessage) {
      case 'NO_DATA_FOUND':
        errorResponseObj.statusCode = 204,
        errorResponseObj.data = {}
        break;

      case 'PROFILE_NOT_FOUND':
        errorResponseObj.statusCode = 400;
        errorResponseObj.data = {
          message: `BAD_REQUEST: User Not Found`
        };
        break;

      case 'INVALID_PROFILE_TYPE':
        errorResponseObj.statusCode = 403;
        errorResponseObj.data = {
          message: `FORBIDDEN: user type forbidden to add amount`
        };
        break;

      case 'DEPOSIT_LIMIT_EXCEEDED':
        errorResponseObj.statusCode = 400;
        errorResponseObj.data = {
          message: `User deposit limit exceeded`
        };
        break;

      case 'TRANSACTION_FAILED_AND_ROLLEDBACK':
        errorResponseObj.statusCode = 400;
        errorResponseObj.data = {
          message: `Transaction failed for user. Please try again after some time.`
        };
        break;

      case "INVALID_DATA":
        errorResponseObj.statusCode = 400;
        errorResponseObj.data = {};
        break;

      case "FORBIDDEN":
        errorResponseObj.statusCode = 403;
        errorResponseObj.data = {};
        break;

      case 'BALANCE_NOT_SUFFICIENT':
        errorResponseObj.statusCode = 402;
        errorResponseObj.data = {
          message: `Please recharge your balance to pay for job`
        }
        break;

      case 'ALREADY_PAID':
        errorResponseObj.statusCode = 400;
        errorResponseObj.data = {}
        break;

      default:
        errorResponseObj.statusCode = 500;
        errorResponseObj.data = {};
        errorResponseObj.message = 'SOMETHING_WENT_WRONG';
        break;
    }
  return errorResponseObj;
}

module.exports = ErrorBuilder