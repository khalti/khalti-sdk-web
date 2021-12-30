import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../semantic-ui/semantic.less";
import SDK from "./sdk";

import { host_ip_address } from "./sdk/constants/APIS";

import {
  EBANKING,
  MOBILE_BANKING,
  KHALTI,
  CONNECT_IPS,
  SCT,
} from "./sdk/constants/literal";

const Widget = () => {
  const [passed_props, setProps] = useState(null);
  const hideModal = () => {
    window.parent.postMessage({ realm: "hide" }, "*");
  };
  const receiveMessage = (event) => {
    if (
      event &&
      event.data &&
      event.data.payload &&
      event.data.payload.amount &&
      event.data.payload.productIdentity
    ) {
      const data = event.data.payload;
      setProps({
        public_key: data.publicKey,
        product_identity: data.productIdentity,
        product_name: data.productName,
        amount: parseInt( data.amount),
        product_url: data.productUrl,
        payment_preference: data.paymentPreference || [
          KHALTI,
          EBANKING,
          MOBILE_BANKING,
          CONNECT_IPS,
          SCT,
        ],
      });
    }

    if (event.origin !== host_ip_address) return;
    let data = JSON.parse(event.data);
    if (data && data.idx) {
      window.parent.postMessage(
        { realm: "walletPaymentVerification", payload: data },
        "*"
      );
    } else {
      window.parent.postMessage({ realm: "widgetError", payload: data }, "*");
    }
  };

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
    () => {
      window.removeEventListenter("message");
    };
  }, []);

  return (
    <React.Fragment>
      {passed_props && Object.keys(passed_props).length && (
        <SDK {...passed_props} hideModal={hideModal} />
      )}
    </React.Fragment>
  );
};

ReactDOM.render(<Widget />, document.getElementById("index"));
//9860802349
//0000
