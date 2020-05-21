import React, { useState, useEffect } from "react";
import axios from "axios";

import * as styles from "./BankStyles.css";
import {
  ebanking_initiation_api,
  queryToString,
  ebanking_list,
  host_ip_address,
} from "../api/APIS";

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
  return (
    <div>
      <div
        className={"ui basic segment " + styles.noborderbox + " pd-top-30"}
        style={{ padding: "20px" }}
      >
        <div className="ui grid">
          <form className="ui form column sixteen wide">
            <div className="field">
              <div className="ui icon input" onChange={handleSearch}>
                <input
                  className="prompt"
                  type="text"
                  placeholder="Search ... "
                />
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
        <div className={"ui grid " + styles.fullheight}>
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
    </div>
  );
};

export default EBanking;
