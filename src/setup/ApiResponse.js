import { PORT, NODE_ENV, HOST } from "../config/env";
const baseURL = ` ${HOST}`;
export function setSuccessResponse(
  data = [],
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    data,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 1,
    APIVersion: 1,
    baseURL: baseURL,
  };
}

export function setSuccessResponseOTP(
  data = [],
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    data,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 2,
    APIVersion: 1,
    baseURL: baseURL,
  };
}

//setWarningOTPResponse
export function setWarningOTPResponse(
  OTP = OTP,
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    OTP: OTP,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 2,
    APIVersion: 1,
    baseURL: baseURL,
  };
}

//setWarningOTPResponse

export function setWarningResponse(
  data = data,
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    data: data,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 0,
    APIVersion: 1,
    baseURL: baseURL,
  };
}

export function setErrorResponse(
  data = [],
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    data: data,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 500,
    APIVersion: 1,
    baseURL: baseURL,
  };
}

export function setErrorResponseZero(
  data = [],
  message,
  message_code,
  message_action,
  api_token
) {
  return {
    data: data,
    api_token: api_token,
    code: 200,
    message: message,
    message_action: message_action,
    message_code: message_code,
    status: 0,
    APIVersion: 1,
    baseURL: baseURL,
  };
}
