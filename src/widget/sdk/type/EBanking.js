import React, { useState, useEffect } from "react";
import axios from "axios";

import * as styles from "./BankStyles.css";
import {
  ebanking_initiation_api,
  queryToString,
  ebanking_list,
} from "../api/APIS";

const listener = () => {
  console.log("adding list");
  window.addEventListener("storage", function (event) {
    console.log("event tirggred");
    if (event.key == "confirmation-data") {
      data = JSON.parse(event.newValue);
      console.log(data, "daadasfasd");
      let merchant = window.parent.msgWidget("walletPaymentVerification", data);
      // this is the final response with looks json shown below
      window.localStorage.removeItem("confirmation-data");
    }
  });
};

const EBanking = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
}) => {
  const [bank_list, setBankList] = useState(null);
  const [bank_selected, setBankSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mobile, setMobileNumber] = useState(null);
  const [errMobile, setErrMobile] = useState(false);
  const changeMobile = () => {
    setMobileNumber(event.target.value);
  };

  const handleSearch = (values) => {
    let search = async () => {
      const { data } = await axios.get(ebanking_list, {
        params: { page_size: 30, search: event.target.value },
      });

      setBankList([...data.records]);
    };
    search();
  };

  useEffect(() => {
    const getBanks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(ebanking_list);
        setBankList([...data.records]);
      } catch (err) {
        console.log(err, "error");
      } finally {
        setLoading(false);
      }
    };
    getBanks();
  }, []);

  useEffect(() => {
    listener();
    () => {
      window.removeEventListener("storage");
    };
  }, []);

  const initiatePay = async () => {
    event.preventDefault();
    if (mobile && mobile.toString().length == 10) {
      setErrMobile(false);
      if (bank_selected.idx) {
        try {
          window.open(
            `${ebanking_initiation_api}?${queryToString({
              public_key,
              product_identity,
              product_name,
              amount,
              source: "web",
              bank: bank_selected.idx,
              mobile,
              product_url,
            })}`,
            "_blank"
          );
        } catch (err) {
          console.log(err, "--err");
        }
      }
    } else {
      setErrMobile(true);
    }
  };

  const bankSelect = (item) => {
    setBankSelected(item);
  };
  return (
    <div className="ui padded segment pd-top-30">
      <div className="ui grid">
        <form className="ui form column sixteen wide">
          <div className="field">
            <div className="ui icon input" onChange={handleSearch}>
              <input className="prompt" type="text" placeholder="Search ... " />
              <i className="search icon"></i>
            </div>
          </div>
        </form>
      </div>
      {bank_selected && (
        <div style={{ padding: "40px 0px" }}>
          <div className="ui list">
            <div className="item">
              <img className="ui avatar image" src={bank_selected.logo} />
              <div className="content">
                <div className="header" style={{ background: "#fff" }}>
                  {bank_selected.name}
                </div>
              </div>
            </div>
          </div>
          <div className="ui grid">
            <div className="eight wide computer sixteen wide mobile column">
              <form className="ui form ">
                <div className="field">
                  <input
                    type="number"
                    name="mobile"
                    placeholder="Mobile Number"
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
        </div>
      )}
      <div className="ui grid" style={{ height: "400px", overflowY: "auto" }}>
        {bank_list &&
          bank_list.map((item) => (
            <div
              className="four wide computer eight wide mobile column"
              onClick={() => bankSelect(item)}
            >
              <div
                className={`${styles.IconContent}  ServiceListIcon pointer ${styles.fullWide}`}
                style={{ display: "block" }}
              >
                <div
                  style={{
                    backgroundImage: "url(" + item.logo + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    height: "120px",
                  }}
                ></div>
                <div className={styles.ServiceName + " text-center"}>
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        {bank_list && bank_list.length == 0 && (
          <div> Sorry no bank could be found.</div>
        )}
      </div>
    </div>
  );
};

export default EBanking;
