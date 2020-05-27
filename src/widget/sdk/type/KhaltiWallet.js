import React, { useState } from "react";
import axios from "axios";
import { initiation_api, confirmation_api } from "../constants/APIS";

import * as styles from "./BankStyles.css";
const KhaltiWallet = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
  hideSDK,
}) => {
  const [otp_code, setOTPCode] = useState(false);
  const [mobile, setMobileNumber] = useState(null);
  const [errMobile, setErrMobile] = useState(null);
  const [token, setToken] = useState(null);
  const [transaction_pin, setPin] = useState(null);
  const [errTranPin, setErrTranPin] = useState(false);

  const [confirmation_code, setCode] = useState(null);
  const [errConCode, setErrConCode] = useState(false);

  const changeMobile = () => {
    setMobileNumber(event.target.value);
  };

  const changePin = () => {
    setPin(event.target.value);
  };

  const changeCode = () => {
    setCode(event.target.value);
  };

  const sendOTPCode = async () => {
    event.preventDefault();
    if (mobile && mobile.toString().length == 10 && transaction_pin) {
      setErrTranPin(false);
      setErrMobile("Please enter a valid mobile number.");
      try {
        const { data } = await axios.post(initiation_api, {
          public_key,
          product_identity,
          product_name,
          amount,
          transaction_pin,
          mobile,
          product_url,
        });
        if (data && data.token) {
          setToken(data.token);
          setOTPCode(true);
          setErrMobile(null);
        }
      } catch (err) {
        if (err.response) {
          let { data } = err.response;
          if (data) {
            setErrMobile("Please enter valid mobile number and pin.");
          }
        }
      }
    } else {
      if (!transaction_pin) {
        setErrTranPin(true);
      } else {
        setErrTranPin(false);
      }
      if (!mobile) {
        setErrMobile("Please enter a valid mobile number.");
      } else {
        if (mobile && mobile.toString().length != 10) {
          setErrMobile("Please enter a valid mobile number.");
        } else {
          setErrMobile(null);
        }
      }
    }
  };
  const confirmPayment = async () => {
    event.preventDefault();
    if (confirmation_code) {
      setErrConCode(false);
      try {
        const { data } = await axios.post(confirmation_api, {
          public_key,
          transaction_pin,
          token,
          confirmation_code,
        });
        if (data && data.idx) {
          setToken(null);
          setOTPCode(false);
          window.parent.postMessage(
            { realm: "walletPaymentVerification", payload: data },
            "*"
          );
          setErrConCode(false);
        }
      } catch (err) {
        if (err.response) {
          let { data } = err.response;
          if (data.confirmation_code || data.detail) {
            setErrConCode(true);
          } else {
            window.parent.postMessage(
              { realm: "widgetError", payload: data },
              "*"
            );
          }
        }
      }
    } else {
      setErrConCode(true);
    }
  };
  return (
    <div className={styles.tabHeight}>
      <div className="ui grid">
        <div className="eight wide computer sixteen wide mobile column">
          <div className="ui padded basic segment">
          <div
            style={{
              backgroundImage:
                "url(https://d7vw40z4bofef.cloudfront.net/static/sdk_logo/khalti.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              height: "100px",
            }}
          ></div>
          <form className="ui form">
            {(!otp_code || token) && (
              <React.Fragment>
                <div className="field">
                  <input
                    type="number"
                    name="mobile"
                    placeholder="Khalti Mobile Number"
                    onChange={changeMobile}
                  />
                  {errMobile && (
                    <div class="ui negative message">
                      <p>{errMobile}</p>
                    </div>
                  )}
                </div>
                <div className="field">
                  <input
                    type="text"
                    name="transaction_pin"
                    placeholder="Khalti Pin"
                    onChange={changePin}
                  />
                  {errTranPin && (
                    <div class="ui negative message">
                      <p>Please enter your transaction pin.</p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}
            {otp_code && (
              <div className="ui icon message">
                <i className="attention icon"></i>
                <div className="content">
                  <p>
                    Khalti has sent a confirmation code in your Khalti
                    registered number.Enter the confirmation code below.
                  </p>
                </div>
              </div>
            )}
            {otp_code && (
              <div className="field">
                <input
                  type="text"
                  name="confirmation_code"
                  placeholder="Confirmation Code"
                  onChange={changeCode}
                />
                {errConCode && (
                  <div class="ui negative message">
                    <p>Please enter your correct confirmation code.</p>
                  </div>
                )}
              </div>
            )}
            {!otp_code && (
              <button
                className="ui button primary"
                type="submit"
                onClick={sendOTPCode}
              >
                Next
              </button>
            )}
            {otp_code && amount && (
              <button
                className="ui button primary"
                type="submit"
                onClick={confirmPayment}
              >
                Pay Rs. {amount / 100}/-
              </button>
            )}
          </form>
          <div className="ui horizontal divider" style={{textTransform: 'unset', color: '#787878', fontWeight: 'normal'}}>Forgot your Khalti PIN?</div>
          <div style={{ textAlign: "center" }}>
            <a
              target="_blank"
              href="https://khalti.com/#/account/transaction_pin"
              style={{ textDecoration: "none", color: "#5d2e8e", textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              Set KHALTI pin
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default KhaltiWallet;
