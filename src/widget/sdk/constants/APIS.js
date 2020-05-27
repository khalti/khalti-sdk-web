
if (!process.env.DEBUG) {
  console.log = function(){};
}

let SERVER = 'https://www.khalti.com/'

if (process.env.NODE_ENV === 'development' ) {
  SERVER = 'http://localhost:8000/'
}

export const host_ip_address = SERVER
export const initiation_api = SERVER + "api/v2/payment/initiate/";
export const confirmation_api = SERVER + "api/v2/payment/confirm/";
export const verification_api = SERVER + "api/v2/payment/verify/";
export const ebanking_initiation_api = SERVER + "v2/ebanking/initiate/";
export const mobile_banking_list =  SERVER + "api/v2/bank/?has_mobile_banking=true";
export const ebanking_list = SERVER + "api/v2/bank/?has_ebanking=true";

export const queryToString = (params) => {
  return Object.keys(params)
    .map((key) =>
      params[key] || params[key] === false ? `${key}=${params[key]}` : `${key}`
    )
    .join("&");
};
