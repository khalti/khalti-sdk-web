import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../semantic-ui/semantic.less";
import SDK from "./sdk";

const receiveMessage = (event) => {
  console.log("erce", event);
  let data = JSON.parse(event.data);
  console.log(data, "- ebanking message received");
};

window.addEventListener("message", receiveMessage, false);

const Widget = (props) => {
  console.log(props, "--------------- props");
  const [show, setShow] = useState(true);
  const hideSDK = () => {
    setShow(false);
  };

  // useEffect(() => {

  //   () => {
  //     window.removeEventListenter("message");
  //   };
  // }, []);
  console.log(window, "Widget");
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

// listen to merchant
window.onmessage = (e) => {
  console.log("message", e);
};

ReactDOM.render(<Widget />, document.getElementById("index"));
//9860802349
//0000
