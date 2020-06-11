import React, { useState } from "react";
import axios from "axios";
import { initiation_api, confirmation_api, validateMobile, validatePin, validateConfermationCode } from "../constants/APIS";
import {KHALTI_BANNER} from '../../../assets/constants';

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
  const [paymentError, setPaymentError] = useState(null);

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
    if (!mobile) {
      setErrMobile('This field is required.')
      return;
    }
    // if (!transaction_pin) {
    //   setErrTranPin('This field is required.')
    //   return;
    // }
    let isFormValid = (!errMobile) && (!errTranPin)
    if (isFormValid) {
      try {
        setPaymentError(null);
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
            const {mobile, amount, transaction_pin, public_key, detail, tries_remaining} = data
            mobile && setErrMobile(mobile.join(' '));
            transaction_pin && setErrTranPin(transaction_pin.join(' '))
            let formError = [];
            if (amount) formError.push(amount.join(' '))
            if (tries_remaining) formError.push(`Attempts Remaining: ${tries_remaining}`)
            if (public_key) formError.push('public_key: ' + public_key.join(' '))
            if (detail) formError.push(<div dangerouslySetInnerHTML={{__html: detail}} />)

            if (formError.length > 0) {
              setPaymentError(formError)
            }
          }
        }
      }
    } else {
      return;
    }
  };
  const confirmPayment = async () => {
    event.preventDefault();
    if (!confirmation_code) {
      setErrConCode('This field is required');
      return;
    }

    if (!errConCode) {
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
      return;
    }
  };
  const onMobileBlur = (e) => {
    e.preventDefault()
    setErrMobile(validateMobile(mobile))
  }
  const onPinBlur = (e) => {
    e.preventDefault()
    setErrTranPin(validatePin(transaction_pin))
  }
  const onConCodeBlur = (e) => {
    e.preventDefault()
    setErrTranPin(validateConfermationCode(confirmation_code))
  }
  return (
    <div className={`${styles.tabHeight}`}>
      <div className="ui grid centered">
        <div className="twelve wide computer sixteen wide mobile column">
          <div className="ui padded basic segment">
            <div
              className={styles.bannerImage}
              style={{
                backgroundImage:
                  `url(${KHALTI_BANNER})`}}
            ></div>
            <form className="ui form">
              {(!otp_code || token) && (
                <React.Fragment>
                  <div className="field">
                    <label>Khalti Mobile Number</label>
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Enter khalti registered number"
                      onChange={changeMobile}
                      onBlur={onMobileBlur}
                    />
                    {errMobile && (
                      <p className={styles.khaltiError}>{errMobile}</p>
                    )}
                  </div>
                  <div className="field">
                    <label>Khalti PIN</label>
                    <input
                      type="password"
                      name="transaction_pin"
                      placeholder="Enter Khalti Pin"
                      onChange={changePin}
                      onBlur={onPinBlur}
                    />
                    {errTranPin && (
                      <p className={styles.khaltiError}>{errTranPin}</p>
                    )}
                  </div>
                </React.Fragment>
              )}
              {paymentError && <div class="ui negative message">
                <ul className='list'>
                  {paymentError.map(i => (
                    <li>{i}</li>
                  ))}
                </ul>
              </div>}
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
                  <label>Confirmation Code</label>
                  <input
                    type="text"
                    name="confirmation_code"
                    placeholder="Enter Confirmation Code (OTP)"
                    onChange={changeCode}
                    onBlur={onConCodeBlur}
                  />
                  {errConCode && (
                    <p className={styles.khaltiError}>{errConCode}</p>
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
            <div
              className="ui horizontal divider"
              style={{
                textTransform: "unset",
                color: "#787878",
                fontWeight: "normal",
              }}
            >
              Forgot your Khalti PIN?
            </div>
            <div style={{ textAlign: "center" }}>
              <a
                target="_blank"
                href="https://khalti.com/#/account/transaction_pin"
                style={{
                  textDecoration: "none",
                  color: "#5d2e8e",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
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
