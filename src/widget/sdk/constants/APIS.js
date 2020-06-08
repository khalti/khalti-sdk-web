if (!process.env.DEBUG) {
  console.log = function () {};
}

const KHALTI_SERVER = process.env.KHALTI_SERVER

export const host_ip_address = KHALTI_SERVER;
export const initiation_api = KHALTI_SERVER + "/api/v2/payment/initiate/";
export const confirmation_api = KHALTI_SERVER + "/api/v2/payment/confirm/";
export const verification_api = KHALTI_SERVER + "/api/v2/payment/verify/";
export const ebanking_initiation_api = KHALTI_SERVER + "/v2/ebanking/initiate/";
export const mobile_banking_list =
  KHALTI_SERVER + "/api/v2/bank/?has_mobile_banking=true";
export const ebanking_list = KHALTI_SERVER + "/api/v2/bank/?has_ebanking=true";

export const queryToString = (params) => {
  return Object.keys(params)
    .map((key) =>
      params[key] || params[key] === false ? `${key}=${params[key]}` : `${key}`
    )
    .join("&");
};
