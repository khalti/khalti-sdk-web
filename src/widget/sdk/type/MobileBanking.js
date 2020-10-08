import React, { useState, useEffect } from "react";
import axios from "axios";

import * as styles from "./BankStyles.css";

import {
  mobile_banking_list,
  queryToString,
  ebanking_initiation_api,
  validateMobile,
} from "../constants/APIS";
const MobileBanking = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
}) => {
  const [bank_list, setBankList] = useState(null);
  const [filtered_list, setFilteredList] = useState(null);
  const [bank_selected, setBankSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mobile, setMobileNumber] = useState(null);
  const [errMobile, setErrMobile] = useState(false);
  const changeMobile = (e) => {
    e.preventDefault()
    setMobileNumber(e.target.value);
  };

  const handleSearch = (e) => {
    let value = e.target.value;
    if (value) {
      value = value.toLowerCase();
      let filtered = bank_list.filter(i => {
        let bank = `${i.name} ${i.short_name}`.toLowerCase();
        return bank.includes(value)
      });
      setFilteredList(filtered)
    } else {
      setFilteredList(bank_list);
    }
  };

  useEffect(() => {
    const getBanks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(mobile_banking_list);
        setBankList([...data.records]);
        setFilteredList([...data.records]);
      } catch (err) {
        console.log(err, "error");
      } finally {
        setLoading(false);
      }
    };
    getBanks();
  }, []);

  const bankSelect = (item) => {
    setBankSelected(item);
  };

  const initiatePay = async (e) => {
    e.preventDefault();
    if (!mobile) {
      setErrMobile("This field is required.");
      return;
    }
    if (!validateMobile(mobile)) {
      setErrMobile(false);
      if (bank_selected.idx) {
        try {
          var myWindow = window.open(
            `${ebanking_initiation_api}?${queryToString({
              public_key,
              product_identity,
              product_name,
              amount,
              payment_type: "mobilecheckout",
              source: "checkout_v2",
              bank: bank_selected.idx,
              mobile,
              product_url,
            })}`
          );
        } catch (err) {
          console.error(err, "--err");
        }
      }
    } else {
      setErrMobile(true);
    }
  };
  const removeBankSelect = (e) => {
    e.preventDefault()
    setBankSelected(null);
  };
  const onMobileBlur = (e) => {
    e.preventDefault();
    setErrMobile(validateMobile(mobile));
  };
  return (
    <div>
      {bank_selected && (
        <div className={styles.bankSelectOuterdiv}>
          <div className={styles.bankSelect}>
            <div className="ui padded basic segment">
            <h3>
              <img
                className="ui avatar image"
                style={{ marginRight: "10px" }}
                src={bank_selected.logo}
              />
              {bank_selected.name}
            </h3>
              <div className="ui grid">
                <div className="eight wide computer sixteen wide mobile column">
                  <div className="ui form ">
                    <div className="field">
                      <input
                        name="mobile"
                        placeholder="Mobile Number"
                        onChange={changeMobile}
                        onBlur={onMobileBlur}
                      />
                      {errMobile && (
                        <div className="ui negative message">
                          <p>{errMobile}</p>
                        </div>
                      )}
                    </div>
                    {amount && (
                      <div
                        className="ui button primary"
                        onClick={initiatePay}
                      >
                        Pay Rs. {amount / 100} /-
                      </div>
                    )}
                    <div className="ui button" onClick={removeBankSelect}>
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={"ui basic segment " + styles.noborderbox + " pd-top-30"}
        style={{ padding: "20px" }}
      >
        <div className="ui grid">
          <div className="three wide computer sixteen wide mobile column">
            <b>Select your Bank</b>
          </div>
          <div className="thirteen wide computer sixteen wide mobile column">
            <div className="ui grid centered" className={styles.searchBankBox}>
              <div className="ui form ten wide computer sixteen wide mobile column">
                <div className="field">
                  <div
                    className="ui transparent icon input"
                    onChange={handleSearch}
                    style={{
                      borderBottom: "2px solid rgb(229, 229, 229)",
                      padding: "5px",
                      fontSize: "15px",
                    }}
                  >
                    <input type="text" placeholder="Search Bank" />
                    <i className="search icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.fullheight}>
          {loading && <div className='ui loading basic segment'></div>}
          <div className={"ui grid "}>
            {filtered_list &&
              filtered_list.map((item, index) => (
                <div
                  key={index}
                  className="four wide computer eight wide mobile column"
                  onClick={() => bankSelect(item)}
                >
                  <div
                    className={`${styles.IconContent}  ServiceListIcon pointer ${styles.fullWide}`}
                    style={{ display: "block", justifyContent: 'center', aligItems: 'center', display: 'grid'}}
                  >
                      <div className={`ui raised circular segment ${styles.bankImageWrapper}`}>
                        <img className={`ui tiny centered image ${styles.bankImageItem}`} src={item.logo} />
                      </div>
                    </div>
                    <div className={styles.ServiceName}>
                    {item.short_name}
                    </div>
                  </div>
              ))}
              {filtered_list && filtered_list.length == 0 && (
                  <div className="column">
                    <div className="ui message">
                      Sorry no bank could be found. Please try again.
                    </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBanking;
