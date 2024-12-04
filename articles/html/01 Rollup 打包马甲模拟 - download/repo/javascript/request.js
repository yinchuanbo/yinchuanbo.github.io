async function httpRequest(url, method = "GET", data = null, headers = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };
  const config = {
    method,
    headers: defaultHeaders,
  };
  if (data && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`799999999HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Request failed", error);
    throw error;
  }
}
export async function getRequest(url, headers = {}) {
  return httpRequest(url, "GET", null, headers);
}
export async function postRequest(url, data, headers = {}) {
  return httpRequest(url, "POST", data, headers);
}
export async function putRequest(url, data, headers = {}) {
  return httpRequest(url, "PUT", data, headers);
}
