## Introduction
Khalti checkout loader for browser.

## Installation
### Yarn
`yarn add khalti-checkout-web`

### npm
`npm install --save khalti-checkout-web`


## Usage
```javascript
import KhaltiCheckout from "khalti-web";

let config = {
  "publicKey": "test_public_key_dc74e0fd57cb46cd93832aee0a507256",
  "productIdentity": "1234567890",
  "productName": "Drogon",
  "productUrl": "http://gameofthrones.com/buy/Dragons",
  "eventHandler": {
    onSuccess (payload) {
      // hit merchant api for initiating verfication
      console.log(payload);
    },
    // onError handler is optional
    onError (error) {
      // handle errors
      console.log(error);
    }
  },
  // one can set the order of payment options and also the payment options based on the order and items in the array
  paymentPreference: [
    "MOBILE_BANKING",
    "KHALTI",
    "EBANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};

let checkout = new KhaltiCheckout(config);
let btn = document.getElementById("payment-button");
btn.onclick = function () {
	checkout.show({amount: 1000});
}
```

Please visit [documentation site](http://docs.khalti.com) for details.
