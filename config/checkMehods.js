import {validationResult , matchedData} from "express-validator"
import ApiError from "./ApiError"

// return response from validations of express validator 
export function checkValidations(req) {

    const validationErrors = validationResult(req).array({ onlyFirstError: true });
    // console.log(validationErrors);
    if (validationErrors.length > 0) {
    //    ApiError(422,validationErrors)
       throw new ApiError(422,validationErrors)
    }
    else{
        return matchedData(req);
    }
  }
