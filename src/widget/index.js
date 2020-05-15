import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../../semantic-ui/semantic.less";
import { tranparent } from "./widget.css";

import SDK from "./sdk";

const Widget = () => {
  const [show, setShow] = useState(true);
  const hideSDK = () => {
    setShow(false);
  };
  return (
    <React.Fragment>
      {show && (
        <SDK
          public_key="test_public_key_02f71893c56b48849716b01465a14cfe"
          product_identity={"idx_pid_1245"}
          product_name={"test_product"}
          amount={2000}
          product_url={"http://www.khalti.com/product/idx_pid_1245"}
          hideSDK={hideSDK}
        />
      )}
    </React.Fragment>
  );
};

ReactDOM.render(<Widget />, document.getElementById("index"));
//9860802349
//0000
