let APIURL = "api/log-error",
  domain = "miocreate.com",
  isProduction = location.host === `www.${domain}` || false,
  apiDmain = isProduction
    ? `https://tool-api.${domain}/`
    : `https://tool-api-test.${domain}/`,
  sendErrorApi = `${apiDmain}${APIURL}`;
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
    this.setupConsoleErrorHandler();
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
    };
    if (errorInfo?.message?.includes?.(APIURL)) {
      console.warn(`Error in ${APIURL} ignored to prevent loop.`);
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
          this.handleError(
            `Failed to load resource: ${
              event.target?.outerHTML || event.target.src || event.target.href
            }`,
            "Resource Load Error"
          );
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

      return originalAddEventListener.call(
        this,
        type,
        wrappedListener,
        options
      );
    };
  },
  setupFrameErrors: function () {
    if (window.frames && window.frames.length) {
      for (let i = 0; i < window.frames.length; i++) {
        try {
          window.frames[i].addEventListener("error", (event) => {
            const error = event.error || event.message;
            this.handleError(error, `Frame Error in frame ${i}`);
            event.preventDefault();
          });
        } catch (e) {
          console.warn(`Unable to add error handler to frame ${i}:`, e);
        }
      }
    }
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
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timed out")),
        this.requestTimeout
      )
    );
    const fetchPromise = fetch(sendErrorApi, {
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
  },
};
ComprehensiveErrorMonitor.init();
