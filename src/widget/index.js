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
  const receiveMessage = (eve) => {

    if (
      eve &&
      eve.data &&
      eve.data.payload &&
      eve.data.payload.amount &&
      eve.data.payload.productIdentity
    ) {
      const data = eve.data.payload;
      setProps({
        public_key: data.publicKey,
        product_identity: data.productIdentity,
        product_name: data.productName,
        amount: data.amount,
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

    if (eve.origin !== host_ip_address) return;
    let data = JSON.parse(eve.data);
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
    return () => {
      window.removeEventListener("message", receiveMessage);
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
