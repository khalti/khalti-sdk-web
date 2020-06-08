import React, { useState, useEffect } from "react";
import axios from "axios";

import * as styles from "./BankStyles.css";
import {
  ebanking_initiation_api,
  queryToString,
  ebanking_list,
} from "../constants/APIS";

const EBanking = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
}) => {
  const [bank_list, setBankList] = useState();
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

  const initiatePay = async (event) => {
    event.preventDefault();
    if (mobile && mobile.toString().length == 10) {
      setErrMobile(false);
      if (bank_selected.idx) {
        try {
          var myWindow = window.open(
            `${ebanking_initiation_api}?${queryToString({
              public_key,
              product_identity,
              product_name,
              amount,
              source: "web",
              bank: bank_selected.idx,
              mobile,
              product_url,
            })}`
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
  const removeBankSelect = (item) => {
    setBankSelected(null);
  };
  return (
    <div>
      {bank_selected && (
        <div className={styles.bankSelect}>
          <div className="ui padded basic segment">
          <h3>
          <img className="ui avatar image" style={{marginRight: '10px'}} src={bank_selected.logo} />
          {bank_selected.name}
          </h3>
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
                  <button class="ui button" onClick={removeBankSelect}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={"ui basic segment " + styles.noborderbox + " pd-top-30"}
        style={{ padding: "20px" }}
      >
        <div className="ui grid centered">
          <div className="three wide computer sixteen wide mobile column">
            <b>Select your Bank</b>
          </div>
          <form className="ui form ten wide computer sixteen wide mobile column">
            <div className="field">
              <div
                class="ui transparent icon input"
                onChange={handleSearch}
                style={{
                  borderBottom: "1px solid #5d2e8e",
                  paddingBottom: "5px",
                  fontSize: "15px",
                }}
              >
                <input type="text" placeholder="Search Bank" />
                <i class="search icon"></i>
              </div>
            </div>
            {bank_list && bank_list.length == 0 && (
              <div> Sorry no bank could be found.</div>
            )}
          </form>
        </div>
        <div class={styles.fullheight}>
          <div className={"ui grid "}>
            {bank_list &&
              bank_list.map((item, index) => (
                <div
                  key={index}
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
                        height: "38px",
                      }}
                    ></div>
                    <div className={styles.ServiceName}>{item.short_name}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBanking;
