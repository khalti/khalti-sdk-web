import { required, validate, isFunction, isObject, isArray } from "validatex";

const paymentType = {
  EBANKING: "EBANKING",
  MOBILE_BANKING: "MOBILE_BANKING",
  CONNECT_IPS: "CONNECT_IPS",
  SCT: "SCT",
  KHALTI: "KHALTI"
}


const CDN_HOST = __CDN_HOST__;

const ZHTML_src = `${CDN_HOST}/payment_gateway_widget.html`;
const INFINITY_LOADER = `${CDN_HOST}/icons/infinity-loader.svg`;

const filter = function (obj, predicate) {
  return Object.keys(obj)
    .map((key) => obj[key])
    .filter(predicate);
};

const forEach = function (data, iteratee) {
  if (Array.isArray(data)) {
    return data.forEach(iteratee);
  }
  return Object.keys(data).map((key) => iteratee(data[key], key));
};

const isInt = function (value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
};

const clone = function (data) {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
};

const eventHandlerSchema = {
  onSuccess: [required(true), isFunction()],
  onError: [required(false), isFunction()],
  onClose: [required(false), isFunction()],
};

const configSchema = {
  publicKey: required(true),
  productUrl: required(true),
  productIdentity: required(true),
  productName: required(true),
  eventHandler: required(true),
  amount: required(true),
  merchantData: [required(false), isObject()],
  paymentPreference: [required(false), isArray()],
};

export default class KhaltiCheckout {
  constructor(config) {
    this._widgetId = "khalti-widget-" + Date.now();
    this._config = config;
    this._widget = this.attachWidget();
    this.listenToWidget();
    this.paymentType = paymentType;
    this.widgetLoaded = false;

  }

  listenToWidget() {
    window.addEventListener(
      "message",
      (e) => {
        if (!e.data.realm) return;
        if (e.data.realm === "widgetInit") {
          this.widgetInit(e.data.payload);
        }
        else if (e.data.realm === 'widgetLoad' && !this.widgetLoaded) {
          if (e.data.payload.loaded) {
            this.hideLoader();
            this.widgetInit();
            this.widgetLoaded = e.data.payload.loaded;
          }
        }
         else if (
          !e.data.payload ||
          e.data.payload.widget_id !== this._widgetId
        ) {
          return;
        }
         else {
          let handler = `handle_msg_${e.data.realm}`;
          this[handler](e.data.payload);
        }
      },
      false
    );
  }

  msgWidget(realm, payload) {
    payload = clone(payload);
    payload.widgetId = this._widgetId;
    payload.source = "checkout_v2.1";
    this._widget.contentWindow.postMessage({ realm, payload }, "*");
  }

  handle_msg_widgetInit() {
    this.widgetInit();
  }

  widgetInit(data) {
    let paymentInfo = clone(this._config);
    delete paymentInfo.eventHandler;
    this.msgWidget("paymentInfo", paymentInfo);
  }

  diplayLoader() {
    let loader = window.document.getElementById('loader' + this._widgetId);
    loader.style.display = 'block';
  }

  hideLoader() {
    let loader = window.document.getElementById('loader' + this._widgetId);
    loader.style.display = 'none';
  }

  validateConfig() {
    let errors = validate(this._config, configSchema);
    if (errors) {
      throw new Error(JSON.stringify(errors));
    } else {
      let errors = validate(this._config.eventHandler, eventHandlerSchema);
      if (errors) {
        throw new Error(JSON.stringify({ eventHandler: errors }));
      }
    }
  }

  handle_msg_walletPaymentVerification(paymentInfo) {
    this._config.eventHandler.onSuccess(paymentInfo);
    this.hide();
  }

  handle_msg_widgetError(error) {
    let errorHandler = this._config.eventHandler.onError;
    errorHandler && errorHandler(error);
  }

  disableParentScrollbar() {
    this.parentOverflowValue = window.document.body.style.overflowY;
    window.document.body.style.overflowY = "hidden";
  }

  enableParentScrollbar() {
    window.document.body.style.overflowY = this.parentOverflowValue;
    this.parentOverflowValue = null;
  }

  show(updates) {

    Object.assign(this._config, updates);
    this.validateConfig();
    this.disableParentScrollbar();
    this._widget.style.display = "block";
    if (this.widgetLoaded) {
      this.widgetInit();
    } else {
      this.diplayLoader();
    }
  }

  handle_msg_hide() {
    this.hide();
    let closeHandler = this._config.eventHandler.onClose;
    closeHandler && closeHandler();
  }

  hide() {
    this.enableParentScrollbar();
    this._widget.style.display = "none";
  }

  attachWidget() {
    var widget = window.document.createElement("iframe");
    widget.setAttribute("id", this._widgetId);
    widget.style.position = "fixed";
    widget.style.display = "none";
    widget.style.top = "0";
    widget.style.left = "0";
    widget.width = "100%";
    widget.height = window.innerHeight + "px";
    widget.setAttribute("src", ZHTML_src);
    widget.style.zIndex = 99999;
    widget.setAttribute("frameborder", 0);
    widget.setAttribute("allowtransparency", true);

    let loader = window.document.createElement('div');
    loader.setAttribute("id", 'loader' + this._widgetId);

    loader.style.width = '100%'
    loader.style.height = '100%';
    loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loader.style.top = '0px';
    loader.style.left = '0px';
    loader.style.position = 'absolute';
    loader.style.display = 'none';
    loader.innerHTML = `<img style="position:relative;left:50%;top:50%;transform:translate(-50%, -50%);z-index: 99999;" src=${INFINITY_LOADER}></img>`
    
    if (!window.document.body.contains(loader)) {
      window.document.body.appendChild(loader);
    }
    
    window.document.body.appendChild(widget);

    return widget;
  }
}
