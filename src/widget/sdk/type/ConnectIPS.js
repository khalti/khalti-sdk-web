import React, { useState } from "react";
import { ebanking_initiation_api } from "../api/APIS";
import axios from "axios";
const ConnectIPS = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
}) => {
  const [mobile, setMobileNumber] = useState(null);
  const [errMobile, setErrMobile] = useState(false);

  const changeMobile = () => {
    setMobileNumber(event.target.value);
  };
  const initiatePay = async () => {
    event.preventDefault();
    0;
    if (mobile && mobile.toString().length == 10) {
      setErrMobile(false);

      try {
        const { data } = await axios.get(ebanking_initiation_api, {
          params: {
            public_key,
            product_identity,
            payment_type: "connectips",
            bank: "connectips",
            source: "web",
            product_name,
            amount,
            mobile,
            product_url,
          },
        });
        console.log(data, "----------- data");
      } catch (err) {
        console.log(err, "--err");
      }
    } else {
      setErrMobile(true);
    }
  };
  return (
    <div className="ui grid padded segment pd-top-30">
      <div className="eight wide computer sixteen wide mobile column">
        <div
          style={{
            backgroundImage:
              "url(https://d7vw40z4bofef.cloudfront.net/static/sdk_logo/connectips.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            height: "160px",
          }}
        ></div>
        <form className="ui form">
          <div className="field">
            <input
              type="text"
              name="first-name"
              placeholder=" Mobile Number"
              onChange={changeMobile}
            />
            {errMobile && (
              <div class="ui negative message">
                <p>Please enter a valid mobile number.</p>
              </div>
            )}
          </div>
          {amount && (
            <button
              className="ui button primary"
              type="submit"
              onClick={initiatePay}
            >
              Pay Rs. {amount / 100} /-
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConnectIPS;