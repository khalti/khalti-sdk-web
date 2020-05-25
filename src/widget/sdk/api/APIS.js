// export const host_ip_address = "http://localhost:8000/";
// const host = "http://localhost:8000/api/v2/";
export const host_ip_address = "https://www.khalti.com";
const host = "https://www.khalti.com/api/v2/";
export const initiation_api = host + "payment/initiate/";
export const confirmation_api = host + "payment/confirm/";
export const verification_api = host + "payment/verify/";

export const ebanking_initiation_api = host + "ebanking/initiate/";

export const mobile_banking_list =
  "https://www.khalti.com/api/bank/?has_mobile_banking=true";
export const ebanking_list =
  "https://www.khalti.com/api/bank/?has_ebanking=true";

export const queryToString = (params) => {
  return Object.keys(params)
    .map((key) =>
      params[key] || params[key] === false ? `${key}=${params[key]}` : `${key}`
    )
    .join("&");
};
