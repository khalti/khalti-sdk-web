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
  // const [activeWidgetId, setActiveWidgetId] = useState(null);
  const hideModal = () => {
    const activeId = localStorage.getItem('activeWidgetId');
    const data = {widget_id: activeId};
    window.parent.postMessage({ realm: "hide", payload: data}, "*");
  };
  const receiveMessage = ({data, origin}) => {
    // mesage from sdk cdn
    if (data && data.payload) {
      let payload = JSON.parse(JSON.stringify(data.payload));
      localStorage.setItem('activeWidgetId', data.payload.widgetId);
      setProps(payload);
    }
    if (origin !== host_ip_address) return;
    // message from khalti server
    const activeId = localStorage.getItem('activeWidgetId');
    let _data = data;
    if (typeof data === 'string') {
      _data = JSON.parse(data)
    }
    _data.widget_id = activeId;
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
    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
      localStorage.clear();
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
