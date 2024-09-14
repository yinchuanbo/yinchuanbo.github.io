export function isValidPhoneNumber(phoneNumber) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}

export function judgeClient() {
  let client = "";
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    client = "ios";
  } else if (/(Android)/i.test(navigator.userAgent)) {
    client = "android";
  } else {
    client = "pc";
  }
  return client;
}

export function $id(selector) {
  var getSelector = document.getElementById(selector);
  if (getSelector) return getSelector;
  return null;
}

function alertB() {
  alert(333);
}

export function alertC() {
  alertB();
  alert(123456);
}
