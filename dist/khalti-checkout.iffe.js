var KhaltiCheckout = (function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var lib = createCommonjsModule(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
			return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
		} : function (obj) {
			return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
		};

		var SkipValidation = exports.SkipValidation = function SkipValidation(message) {
			this.name = "SkipValidation";
			this.message = message;
		};

		var validateSingle = exports.validateSingle = function validateSingle(data, validators, multipleErrors, all, key) {
			var errors = [];

			if (typeof validators === "function") {
				validators = [validators];
			}

			for (var i = 0; i < validators.length; i++) {
				try {
					var error = validators[i](data, all);
					if (typeof error === "string") {
						errors.push(error.replace("{value}", data).replace("{key}", key));
					}
				} catch (err) {
					if (err instanceof SkipValidation) {
						break;
					}
				}
			}

			if (multipleErrors === true) return errors;

			if (errors.length > 0) return errors[0];
		};

		var validate = exports.validate = function validate(data, validators, multipleErrors) {
			if (!validators) return;

			var errors = {};
			var noError = true;

			if ((typeof validators === "undefined" ? "undefined" : _typeof(validators)) === "object" && !validators.length) {
				for (var prop in validators) {
					if (validators.hasOwnProperty(prop)) {
						var error = validateSingle(data[prop], validators[prop], multipleErrors, data, prop);

						if (error !== undefined) {
							noError = false;
						}

						errors[prop] = error;
					}
				}

				return noError ? undefined : errors;
			}

			errors = validateSingle(data, validators, multipleErrors);
			return errors;
		};

		var required = exports.required = function required(flag, error) {
			function isNullLike(value) {
				return value === undefined || value === "" || value === null;
			}

			return function (value) {
				if (flag && isNullLike(value)) {
					return error || "This field is required.";
				} else if (!flag && isNullLike(value)) {
					// skip rest of the validators
					throw new SkipValidation();
				}
			};
		};

		var isNumber = exports.isNumber = function isNumber(error) {
			return function (value) {
				if (typeof value !== "number" || isNaN(value)) {
					return error || "'{value}' is not a valid number.";
				}
			};
		};

		var isString = exports.isString = function isString(error) {
			return function (value) {
				if (typeof value !== "string") {
					return error || "'{value}' is not a valid string.";
				}
			};
		};

		var isFunction = exports.isFunction = function isFunction(error) {
			return function (value) {
				if (typeof value !== "function") {
					return error || "Expected a function.";
				}
			};
		};

		var isObject = exports.isObject = function isObject(error) {
			return function (value) {
				if (value !== Object(value)) {
					return error || "Expected an object.";
				}
			};
		};

		var isArray = exports.isArray = function isArray(error) {
			return function (value) {
				if (Object.prototype.toString.call(value) !== "[object Array]") {
					return error || "Expected an array.";
				}
			};
		};

		var length = exports.length = function length(_length, error) {
			return function (value) {
				var str = value + "";
				if (str.length !== _length) {
					return error || "It must be " + _length + " characters long.";
				}
			};
		};

		var isEmail = exports.isEmail = function isEmail(error) {
			return function (value) {
				var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!pattern.test(value)) {
					return error || "Invalid email id.";
				}
			};
		};

		var equalsTo = exports.equalsTo = function equalsTo(key, error) {
			return function (value, all) {
				if (value !== all[key]) {
					return error || "'{key}' and '" + key + "' do not match.";
				}
			};
		};

		var minLength = exports.minLength = function minLength(length, error) {
			return function (value) {
				var str = value + "";
				if (str.length < length) {
					return error || "It must be at least " + length + " characters long.";
				}
			};
		};

		var maxLength = exports.maxLength = function maxLength(length, error) {
			return function (value) {
				var str = value + "";
				if (str.length > length) {
					return error || "It must be at most " + length + " characters long.";
				}
			};
		};

		var isBoolean = exports.isBoolean = function isBoolean(error) {
			return function (value) {
				if (value !== true && value !== false) {
					return error || "Invalid boolean value.";
				}
			};
		};

		var within = exports.within = function within(list, error) {
			return function (value) {
				if (!(value instanceof Array)) {
					value = [value];
				}

				var odds = [];

				for (var index = 0; index < value.length; index++) {
					if (list.indexOf(value[index]) === -1) {
						odds.push(value[index]);
					}
				}

				if (odds.length > 0) {
					return error || "[" + odds + "] do not fall under the allowed list.";
				}
			};
		};

		var excludes = exports.excludes = function excludes(list, error) {
			return function (value) {
				if (!(value instanceof Array)) {
					value = [value];
				}

				var odds = [];

				for (var index = 0; index < value.length; index++) {
					if (list.indexOf(value[index]) !== -1) {
						odds.push(value[index]);
					}
				}

				if (odds.length > 0) {
					return error || "[" + odds + "] fall under restricted values.";
				}
			};
		};

		var pattern = exports.pattern = function pattern(regex, error) {
			return function (value) {
				if (!regex.test(value)) {
					return error || "'{value}' does not match with the pattern.";
				}
			};
		};
	});

	unwrapExports(lib);
	var lib_1 = lib.SkipValidation;
	var lib_2 = lib.validateSingle;
	var lib_3 = lib.validate;
	var lib_4 = lib.required;
	var lib_5 = lib.isNumber;
	var lib_6 = lib.isString;
	var lib_7 = lib.isFunction;
	var lib_8 = lib.isObject;
	var lib_9 = lib.isArray;
	var lib_10 = lib.length;
	var lib_11 = lib.isEmail;
	var lib_12 = lib.equalsTo;
	var lib_13 = lib.minLength;
	var lib_14 = lib.maxLength;
	var lib_15 = lib.isBoolean;
	var lib_16 = lib.within;
	var lib_17 = lib.excludes;
	var lib_18 = lib.pattern;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var paymentType = {
	  EBANKING: "EBANKING",
	  MOBILE_BANKING: "MOBILE_BANKING",
	  CONNECT_IPS: "CONNECT_IPS",
	  SCT: "SCT",
	  KHALTI: "KHALTI"
	};

	var CDN_HOST = "http://localhost:8888/dist";

	var ZHTML = "<!DOCTYPE html> <html lang=\"en\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /> <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" /> <title>Khalti Checkout</title> </head> <body style=\"background: transparent;\"> <div id=\"index\"></div> <script type=\"text/javascript\" src=\"" + CDN_HOST + "/widget.js\"></script> </body> </html>";

	var clone = function clone(data) {
	  if (!data) return data;
	  return JSON.parse(JSON.stringify(data));
	};

	var eventHandlerSchema = {
	  onSuccess: [lib_4(true), lib_7()],
	  onError: [lib_4(false), lib_7()],
	  onClose: [lib_4(false), lib_7()]
	};

	var configSchema = {
	  publicKey: lib_4(true),
	  productUrl: lib_4(true),
	  productIdentity: lib_4(true),
	  productName: lib_4(true),
	  eventHandler: lib_4(true),
	  amount: lib_4(true),
	  merchantData: [lib_4(false), lib_8()],
	  paymentPreference: [lib_4(false), lib_9()]
	};

	var KhaltiCheckout = function () {
	  function KhaltiCheckout(config) {
	    _classCallCheck(this, KhaltiCheckout);

	    this._widgetId = "khalti-widget-" + Date.now();
	    this._config = config;
	    this._widget = this.attachWidget();
	    this.listenToWidget();
	    this.paymentType = paymentType;
	  }

	  _createClass(KhaltiCheckout, [{
	    key: "listenToWidget",
	    value: function listenToWidget() {
	      var _this = this;

	      window.addEventListener("message", function (e) {
	        if (!e.data.realm) return;
	        if (e.data.realm === "widgetInit") {
	          _this.widgetInit(e.data.payload);
	        } else if (e.data.realm === "walletPaymentVerification") {
	          var handler = "handle_msg_" + e.data.realm;
	          _this[handler](e.data.payload);
	        } else if (e.data.realm === "widgetError") {
	          var _handler = "handle_msg_" + e.data.realm;
	          _this[_handler](e.data.payload);
	        } else if (e.data.realm === "hide") {
	          _this.hide();
	          return;
	        } else if (!e.data.payload || e.data.payload.widget_id !== _this._widgetId) {
	          return;
	        } else {
	          var _handler2 = "handle_msg_" + e.data.realm;
	          _this[_handler2](e.data.payload);
	        }
	      }, false);
	    }
	  }, {
	    key: "msgWidget",
	    value: function msgWidget(realm, payload) {
	      payload = clone(payload);
	      payload.widgetId = this._widgetId;
	      this._widget.contentWindow.postMessage({ realm: realm, payload: payload }, "*");
	    }
	  }, {
	    key: "handle_msg_widgetInit",
	    value: function handle_msg_widgetInit() {
	      this.widgetInit();
	    }
	  }, {
	    key: "widgetInit",
	    value: function widgetInit() {
	      var paymentInfo = clone(this._config);
	      delete paymentInfo.eventHandler;
	      this.msgWidget("paymentInfo", paymentInfo);
	    }
	  }, {
	    key: "validateConfig",
	    value: function validateConfig() {
	      var errors = lib_3(this._config, configSchema);
	      if (errors) {
	        throw new Error(JSON.stringify(errors));
	      } else {
	        var _errors = lib_3(this._config.eventHandler, eventHandlerSchema);
	        if (_errors) {
	          throw new Error(JSON.stringify({ eventHandler: _errors }));
	        }
	      }
	    }
	  }, {
	    key: "handle_msg_walletPaymentVerification",
	    value: function handle_msg_walletPaymentVerification(paymentInfo) {
	      this._config.eventHandler.onSuccess(paymentInfo);
	      this.hide();
	    }
	  }, {
	    key: "handle_msg_widgetError",
	    value: function handle_msg_widgetError(error) {
	      var errorHandler = this._config.eventHandler.onError;
	      errorHandler && errorHandler(error);
	    }
	  }, {
	    key: "disableParentScrollbar",
	    value: function disableParentScrollbar() {
	      this.parentOverflowValue = window.document.body.style.overflowY;
	      window.document.body.style.overflowY = "hidden";
	    }
	  }, {
	    key: "enableParentScrollbar",
	    value: function enableParentScrollbar() {
	      window.document.body.style.overflowY = this.parentOverflowValue;
	      this.parentOverflowValue = null;
	    }
	  }, {
	    key: "show",
	    value: function show(updates) {
	      this._config.source = "web";
	      // this._widget.setAttribute("src", WIDGET_URL);
	      Object.assign(this._config, updates);
	      this.validateConfig();
	      this.disableParentScrollbar();
	      this._widget.style.display = "block";
	      this._widget.contentWindow.postMessage("testing", "*");
	      this.widgetInit();
	    }
	  }, {
	    key: "handle_msg_hide",
	    value: function handle_msg_hide() {
	      this.hide();
	      var closeHandler = this._config.eventHandler.onClose;
	      closeHandler && closeHandler();
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      this.enableParentScrollbar();
	      this._widget.style.display = "none";
	    }
	  }, {
	    key: "attachWidget",
	    value: function attachWidget() {
	      var widget = window.document.createElement("iframe");
	      widget.setAttribute("id", this._widgetId);
	      widget.style.position = "fixed";
	      widget.style.display = "none";
	      widget.style.top = "0";
	      widget.style.left = "0";
	      widget.width = "100%";
	      widget.height = window.innerHeight + "px";
	      widget.setAttribute("srcdoc", ZHTML);
	      widget.style.zIndex = 999999999;
	      widget.setAttribute("frameborder", 0);
	      widget.setAttribute("allowtransparency", true);

	      window.document.body.appendChild(widget);

	      return widget;
	    }
	  }]);

	  return KhaltiCheckout;
	}();

	return KhaltiCheckout;

}());
