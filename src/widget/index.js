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
    const data = {widget_id: window.activeWidget};
    window.parent.postMessage({ realm: "hide", payload: data}, "*");
  };
  const receiveMessage = ({data, origin}) => {
    if (data && data.payload) {
      let payload = JSON.parse(JSON.stringify(data.payload));
      window.activeWidget = data.payload.widgetId
      setProps(payload);
    }
    if (origin !== host_ip_address) return;

    let _data = data;
    if (typeof data === 'string') {
      _data = JSON.parse(data)
    }
    _data.widget_id = window.activeWidget;
    if (_data && _data.idx) {
      window.parent.postMessage(
        { realm: "walletPaymentVerification", payload: _data },
        "*"
      );
    } else {
      window.parent.postMessage({ realm: "widgetError", payload: _data }, "*");
    }
  };

  useEffect(() => {
    // document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
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
