if (!process.env.DEBUG) {
  console.log = function () {};
}

const KHALTI_SERVER = process.env.KHALTI_SERVER || "http://localhost:8000";

export const host_ip_address = KHALTI_SERVER;
export const initiation_api = KHALTI_SERVER + "/api/v2/payment/initiate/";
export const confirmation_api = KHALTI_SERVER + "/api/v2/payment/confirm/";
export const verification_api = KHALTI_SERVER + "/api/v2/payment/verify/";
export const ebanking_initiation_api = KHALTI_SERVER + "/ebanking/initiate/";
export const mobile_banking_list =
  KHALTI_SERVER + "/api/v2/bank/?payment_type=mobilecheckout&page_size=100";
export const ebanking_list =
  KHALTI_SERVER + "/api/v2/bank/?payment_type=sdkebanking&page_size=100";

export const queryToString = (params) => {
  return Object.keys(params)
    .map((key) =>
      params[key] || params[key] === false ? `${key}=${params[key]}` : `${key}`
    )
    .join("&");
};

export const validateMobile = (value) => {
  if (!value) return;
  value = value.toString().trim();
  let format = new RegExp("^9[678]\\d{8}$");
  if (value.length !== 10) return "Mobile number must be 10 digits long.";
  if (!format.test(value)) return "Please enter a valid mobile number";
};

export const validatePin = (value) => {
  if (!value) return;
  value = value.toString().trim();
  let format = /^\d{4}$/;
  if (value.length !== 4) return "Khalti PIN must be 4 digits long.";
  if (!format.test(value)) return "Please enter a valid Khalti PIN";
};

export const validateConfermationCode = (value) => {
  if (!value) return;
  value = value.toString().trim();
  let format = /^\d{6}$/;
  if (value.length !== 6) return "Confirmation Code must be 6 digits long.";
  if (!format.test(value)) return "Please enter a valid Confirmation Code";
};
