import React, { useEffect, useState } from "react";
import KhaltiWallet from "./type/KhaltiWallet";
import EBanking from "./type/EBanking";
import MobileBanking from "./type/MobileBanking";
import ConnectIPS from "./type/ConnectIPS";
import SCTCard from "./type/SCTCard";

import * as styles from "../css/index.css";

const SDK = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
  hideSDK,
}) => {
  const [activeTab, setActiveTab] = useState({ tab: "first" });
  const [modalState, setModalState] = useState(true);
  const [loading, setLoading] = useState(true);
  const getActiveTab = (obj) => {
    setActiveTab(obj);
  };
  const hideModal = () => {
    setModalState(false);
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <React.Fragment>
      {modalState && (
        <div
          style={{
            position: "absolute",
            top: "0%",
            left: "0%",
            background: "rgba(0,0,0,0.75)",
            width: "100%",
            height: "100%",
          }}
        >
          {loading && (
            <div className="ui active dimmer">
              <div className="ui text loader">Loading</div>
            </div>
          )}
          {!loading && (
            <div
              style={{ backgroundColor: "#fff" }}
              className={styles.modalScreen}
            >
              <div className="ui">
                <div style={{ padding: "20px" }}>
                  <div
                    className="ui pointing secondary menu"
                    style={{ overflowX: "auto", overflowY: "hidden" }}
                  >
                    <a
                      className={
                        activeTab.tab == "first" ? "item active" : "item"
                      }
                      data-tab="first"
                      onClick={() => getActiveTab({ tab: "first" })}
                    >
                      <img src="assets/icons/mywallet.svg  " height="14px" />
                      Khalti Wallet
                    </a>
                    <a
                      className={
                        activeTab.tab == "second" ? "item active" : "item"
                      }
                      data-tab="second"
                      onClick={() => getActiveTab({ tab: "second" })}
                    >
                      <img src="assets/icons/ebanking.svg  " height="14px" />
                      eBanking
                    </a>
                    <a
                      className={
                        activeTab.tab == "third" ? "item active" : "item"
                      }
                      data-tab="third"
                      onClick={() => getActiveTab({ tab: "third" })}
                    >
                      <img
                        src="assets/icons/mobile-banking.svg  "
                        height="14px"
                      />
                      Mobile Banking
                    </a>
                    <a
                      className={
                        activeTab.tab == "fourth" ? "item active" : "item"
                      }
                      data-tab="fourth"
                      onClick={() => getActiveTab({ tab: "fourth" })}
                    >
                      <img src="assets/icons/connectIPS.svg  " height="14px" />
                      Connect IPS
                    </a>
                    <a
                      className={
                        activeTab.tab == "fifth" ? "item active" : "item"
                      }
                      data-tab="fifth"
                      onClick={() => getActiveTab({ tab: "fifth" })}
                    >
                      <img src="assets/icons/sct-card.svg  " height="14px" />
                      SCT Card
                    </a>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute ",
                    top: 0,
                    right: 0,
                    padding: "8px",
                    cursor: "pointer",
                  }}
                  onClick={hideModal}
                >
                  <img src="assets/icons/close.svg  " height="14px" />
                </div>
                <div className="content">
                  {activeTab && activeTab.tab && (
                    <div
                      className={
                        activeTab.tab == "first" ? "ui tab active" : "ui tab"
                      }
                      data-tab="first"
                    >
                      {
                        <KhaltiWallet
                          public_key={public_key}
                          product_identity={product_identity}
                          product_name={product_name}
                          amount={amount}
                          product_url={product_url}
                          hideSDK={hideSDK}
                        />
                      }
                    </div>
                  )}
                  <div
                    className={
                      activeTab.tab == "second" ? "ui tab active" : "ui tab"
                    }
                    data-tab="second"
                  >
                    {
                      <EBanking
                        public_key={public_key}
                        product_identity={product_identity}
                        product_name={product_name}
                        amount={amount}
                        product_url={product_url}
                        hideSDK={hideSDK}
                      />
                    }
                  </div>
                  <div
                    className={
                      activeTab.tab == "third" ? "ui tab active" : "ui tab"
                    }
                  >
                    {
                      <MobileBanking
                        public_key={public_key}
                        product_identity={product_identity}
                        product_name={product_name}
                        amount={amount}
                        product_url={product_url}
                      />
                    }
                  </div>
                  <div
                    className={
                      activeTab.tab == "fourth" ? "ui tab active" : "ui tab"
                    }
                    data-tab="fourth"
                  >
                    {
                      <ConnectIPS
                        public_key={public_key}
                        product_identity={product_identity}
                        product_name={product_name}
                        amount={amount}
                        product_url={product_url}
                      />
                    }
                  </div>
                  <div
                    className={
                      activeTab.tab == "fifth" ? "ui tab active" : "ui tab"
                    }
                    data-tab="fifth"
                  >
                    {
                      <SCTCard
                        public_key={public_key}
                        product_identity={product_identity}
                        product_name={product_name}
                        amount={amount}
                        product_url={product_url}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};
export default SDK;
