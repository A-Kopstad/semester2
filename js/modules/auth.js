//-- StoreToken 
export { storeToken };
//-- getToken 
export { getToken };
//-- clearToken
export { clearToken };

//API Key
export const apiKey = "8cbb77a9-bf83-4c1a-a541-1e3936c3abd0";


//-- JWT Token 
function storeToken(token) {
  localStorage.setItem("accessToken", token);
}

function getToken() {
  return localStorage.getItem("accessToken");
}

function clearToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
}