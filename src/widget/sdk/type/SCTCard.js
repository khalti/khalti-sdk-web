import React, { useState } from "react";

import {
  ebanking_initiation_api,
  queryToString,
  validateMobile,
} from "../constants/APIS";
import { SCT_BANNER } from "../../../assets/constants";
import * as styles from "./BankStyles.css";

const SCTCard = ({
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
    if (mobile && !validateMobile(mobile)) {
      setErrMobile(false);
      try {
        var myWindow = window.open(
          `${ebanking_initiation_api}?${queryToString({
            public_key,
            product_identity,
            product_name,
            amount,
            payment_type: "sct",
            source: "checkout_v2",
            bank: "npay",
            mobile,
            product_url,
          })}`
        );
      } catch (err) {
        console.log(err, "--err");
      }
    } else {
      setErrMobile(true);
    }
  };
  return (
    <div className={styles.tabHeight}>
      <div className="ui grid centered">
        <div className="twelve wide computer sixteen wide mobile column">
          <div className="ui padded basic segment">
            <div
              className={styles.bannerImage}
              style={{
                backgroundImage: `url(${SCT_BANNER})`,
              }}
            ></div>
            <form className="ui form">
              <div className="field">
                <label>Mobile Number</label>
                <input
                  type="number"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  onChange={changeMobile}
                />
                {errMobile && (
                  <div class="ui negative message">
                    <p>Please enter a valid mobile number.</p>
                  </div>
                )}
              </div>

              {amount && (
                <div className={styles.mobileCenter}>
                  <button
                    className="ui button primary"
                    type="submit"
                    onClick={initiatePay}
                  >
                    Pay Rs. {amount / 100} /-
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCTCard;
