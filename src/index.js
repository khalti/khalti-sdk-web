import { required, validate, isFunction, isObject, isArray } from "validatex";

const WIDGET_URL = __CDN_HOST__ + '/index.html'

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
  }

  listenToWidget() {
    window.addEventListener(
      "message",
      (e) => {
        console.log("message received by merchant", e);
        if (!e.data.realm) return;
        if (e.data.realm === "widgetInit") {
          console.log(13);
          this.widgetInit(e.data.payload);
        } else if (e.data.realm === "walletPaymentVerification") {
          let handler = `handle_msg_${e.data.realm}`;
          this[handler](e.data.payload);
        } else if (e.data.realm === "widgetError") {
          let handler = `handle_msg_${e.data.realm}`;
          this[handler](e.data.payload);
        } else if (e.data.realm === "hide") {
          this.hide();
          return;
        } else if (
          !e.data.payload ||
          e.data.payload.widget_id !== this._widgetId
        ) {
          console.log(34);
          return;
        } else {
          let handler = `handle_msg_${e.data.realm}`;
          this[handler](e.data.payload);
        }
      },
      false
    );
  }

  msgWidget(realm, payload) {
    payload = clone(payload);
    console.log(payload, this._widget.contentWindow, "msgWidget");
    payload.widgetId = this._widgetId;
    this._widget.contentWindow.postMessage({ realm, payload }, "*");
  }

  handle_msg_widgetInit() {
    this.widgetInit();
  }

  widgetInit() {
    let paymentInfo = clone(this._config);
    delete paymentInfo.eventHandler;
    this.msgWidget("paymentInfo", paymentInfo);
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
    console.log("success triggered");
    this._config.eventHandler.onSuccess(paymentInfo);
    this.hide();
  }

  handle_msg_widgetError(error) {
    console.log("error triggered", error);
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
    this._config.source = "web";
    // this._widget.setAttribute("src", WIDGET_URL);
    Object.assign(this._config, updates);
    this.validateConfig();
    this.disableParentScrollbar();
    this._widget.style.display = "block";
    this._widget.contentWindow.postMessage("testing", "*");
    this.widgetInit();
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
    widget.setAttribute("src", WIDGET_URL);
    widget.style.zIndex = 999999999;
    widget.setAttribute("frameborder", 0);
    widget.setAttribute("allowtransparency", true);

    window.document.body.appendChild(widget);

    return widget;
  }
}
