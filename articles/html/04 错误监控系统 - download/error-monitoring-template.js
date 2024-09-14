let APIURL_ERROR = "api/notification/exception",
  DOMAIN_ERROR = "miocreate.com",
  ISPRO_ERROR = location.host === `www.${DOMAIN_ERROR}` || false,
  APIDOMAIN_ERROR = ISPRO_ERROR
    ? `https://tool-api.${DOMAIN_ERROR}/`
    : `https://tool-api-test.${DOMAIN_ERROR}/`,
  SEND_ERRORAPI = `${APIDOMAIN_ERROR}${APIURL_ERROR}`;
const ComprehensiveErrorMonitor = {
  lastErrorInfos: [],
  lastIsComplete: true,
  lastRequestTime: 0,
  requestThrottle: 10000,
  requestTimeout: 20000,
  init: function () {
    this.setupGlobalErrorHandler();
    this.setupPromiseErrorHandler();
    this.setupRequestErrorHandler();
    // this.setupConsoleErrorHandler();
    this.setupResourceErrorHandler();
    this.setupCustomElementsErrorHandler();
    this.setupWebWorkerErrorHandler();
    this.setupEventListenerErrors();
    this.setupFrameErrors();
  },
  convertToTimeZone: function (isoString, timeZone = "Asia/Shanghai") {
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", { timeZone });
  },
  handleError: function (error, errorType) {
    const errorInfo = {
      type: errorType,
      message: error.message || error,
      stack: error.stack || "",
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: this.convertToTimeZone(new Date().toISOString()),
      env: ISPRO_ERROR ? "pro" : "dev",
    };
    if (errorInfo?.message?.includes?.(APIURL_ERROR)) {
      console.warn(`Error in ${APIURL_ERROR} ignored to prevent loop.`);
      return;
    }
    this.sendErrorToServer(errorInfo);
  },
  setupGlobalErrorHandler: function () {
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleError(error || message, "Global JavaScript Error");
      return true;
    };
  },
  setupPromiseErrorHandler: function () {
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(event.reason, "Unhandled Promise Rejection");
    });
  },
  noHandleUrlByReq: function (url = "") {
    return (
      url.includes("google") ||
      url.includes("facebook") ||
      url.includes("twitter") ||
      url.includes("linkedin") ||
      url.includes("youtube")
    );
  },
  setupRequestErrorHandler: function () {
    const _this = this;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      const xhr = this;
      const url = xhr._url || this.responseURL || "";
      const isOtherUrl = _this.noHandleUrlByReq(url);
      this.addEventListener("error", (event) => {
        if (!isOtherUrl) {
          ComprehensiveErrorMonitor.handleError(
            `AJAX Error: ${url} failed`,
            "AJAX Error"
          );
        }
      });
      this.addEventListener("load", () => {
        if (!isOtherUrl && xhr.status >= 400) {
          ComprehensiveErrorMonitor.handleError(
            `HTTP ${xhr.status}: ${xhr.statusText} at ${url}`,
            "AJAX Error"
          );
        }
      });
      originalXHRSend.apply(this, arguments);
    };
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      originalOpen.apply(this, arguments);
    };
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function (input, options) {
        let url = input;
        if (typeof input === "object" && input.url) {
          url = input.url;
        }
        const isOtherUrl = _this.noHandleUrlByReq(url);
        return originalFetch
          .apply(this, arguments)
          .then((response) => {
            if (!isOtherUrl && !response.ok) {
              ComprehensiveErrorMonitor.handleError(
                `HTTP ${response.status}: ${response.statusText} at ${response.url}`,
                "Fetch Error"
              );
            }
            return response;
          })
          .catch((error) => {
            if (!isOtherUrl) {
              ComprehensiveErrorMonitor.handleError(
                `Fetch Error: ${url}`,
                "Fetch Error"
              );
            }
            throw error;
          });
      };
    }
  },
  setupConsoleErrorHandler: function () {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleError(args.join(" "), "Console Error");
      originalConsoleError.apply(console, args);
    };
  },
  setupResourceErrorHandler: function () {
    const _this = this;
    window.addEventListener(
      "error",
      (event) => {
        if (
          event.target &&
          (event.target.tagName === "LINK" ||
            event.target.tagName === "SCRIPT" ||
            event.target.tagName === "IMG")
        ) {
          if (
            event.target.tagName === "IMG" &&
            !event.target.getAttribute("src")
          )
            return;
          const src = event.target.src || event.target.href;
          const isOtherUrl = _this.noHandleUrlByReq(src);
          if (!isOtherUrl) {
            this.handleError(
              `Failed to load resource: ${event.target?.outerHTML || src}`,
              "Resource Load Error"
            );
          }
        }
      },
      true
    );
  },
  setupCustomElementsErrorHandler: function () {
    if (window.customElements) {
      const originalDefine = window.customElements.define;
      window.customElements.define = function (name, constructor, options) {
        try {
          return originalDefine.call(
            window.customElements,
            name,
            constructor,
            options
          );
        } catch (error) {
          ComprehensiveErrorMonitor.handleError(error, "Custom Element Error");
          throw error;
        }
      };
    }
  },
  setupWebWorkerErrorHandler: function () {
    if (window.Worker) {
      const originalWorker = window.Worker;
      window.Worker = function (scriptURL, options) {
        const worker = new originalWorker(scriptURL, options);
        worker.addEventListener("error", (event) => {
          const errorMessage = `Error in worker: ${event.message} at ${event.filename}:${event.lineno}`;
          ComprehensiveErrorMonitor.handleError(
            errorMessage,
            "Web Worker Error"
          );
        });

        return worker;
      };
    }
  },
  setupEventListenerErrors: function () {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener =
      EventTarget.prototype.removeEventListener;
    const wrappedListeners = new WeakMap();

    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      if (typeof listener !== "function") {
        throw new TypeError("Listener must be a function");
      }

      const wrappedListener = function (event) {
        try {
          listener.call(this, event);
        } catch (error) {
          ComprehensiveErrorMonitor.handleError(error, "Event Listener Error");
          throw error;
        }
      };

      wrappedListeners.set(listener, wrappedListener);
      return originalAddEventListener.call(
        this,
        type,
        wrappedListener,
        options
      );
    };

    EventTarget.prototype.removeEventListener = function (
      type,
      listener,
      options
    ) {
      const wrappedListener = wrappedListeners.get(listener);
      if (wrappedListener) {
        return originalRemoveEventListener.call(
          this,
          type,
          wrappedListener,
          options
        );
      } else {
        return originalRemoveEventListener.call(this, type, listener, options);
      }
    };
  },
  setupFrameErrors: function () {
    window.addEventListener("error", (event) => {
      const error = event.error || event.message;
      this.handleError(error, "Frame Error");
      event.preventDefault();
    });
  },
  sendErrorToServer: function (errorInfo) {
    const currentTime = Date.now();
    const findObj = this.lastErrorInfos.find(
      (item) =>
        item.message === errorInfo.message &&
        item.stack === errorInfo.stack &&
        item.url === errorInfo.url
    );
    if (
      findObj ||
      !this.lastIsComplete ||
      currentTime - this.lastRequestTime < this.requestThrottle
    ) {
      return;
    }
    this.lastIsComplete = false;
    this.lastRequestTime = currentTime;

    if (navigator?.sendBeacon) {
      navigator.sendBeacon(SEND_ERRORAPI, JSON.stringify(errorInfo));
      this.lastIsComplete = true;
      this.lastErrorInfos.push(errorInfo);
    } else {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out")),
          this.requestTimeout
        )
      );
      const fetchPromise = fetch(SEND_ERRORAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorInfo),
      });
      Promise.race([fetchPromise, timeoutPromise])
        .then(() => {
          this.lastIsComplete = true;
          this.lastErrorInfos.push(errorInfo);
        })
        .catch((error) => {
          this.lastIsComplete = true;
          if (error.message === "Request timed out") {
            console.warn("Request to server timed out.");
          } else {
            console.warn("Failed to send error to server:", error);
          }
        });
    }
  },
};
ComprehensiveErrorMonitor.init();
