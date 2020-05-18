import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../semantic-ui/semantic.less";
import SDK from "./sdk";

const Widget = (props) => {
  console.log(props, "--------------- props");
  const [show, setShow] = useState(true);
  const hideSDK = () => {
    console.log('closeing');
    window.parent.postMessage('test', '*')
    setShow(false);
  };

  return (
    <React.Fragment>
      {show && (
        <SDK
          public_key="test_public_key_671f0dbb8e3c4fde8903c95f74df87bd"
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
