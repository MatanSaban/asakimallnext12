import axios from "axios";

export async function authenticateUser(userEmail, password) {
  //   console.log(password);
  let theResult = false;
  let myHeaders = "";

  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    pass: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const checkAuth = await fetch(`/api/users/${userEmail}`, requestOptions);
  const answer = await checkAuth.json();
  console.log("answer");
  console.log(typeof answer);
  if (answer && typeof answer === "string") {
    theResult = true;
    cookieCutter.set("loggedIn", true);
    cookieCutter.set("userToken", `${answer}j666x${answer}`);
  }
  return theResult;
}



export const emailOrPhoneExistCheck = async (email, phone) => {
  let existQuery = [];
  const res = await axios.post('/api/existCheck', [email, phone]);
  const data = await res.data;
  existQuery = data;

  return existQuery

}

export const updateUser = async (userId, body) => {
  const put = await axios.put(`/api/users/${userId}`, body);
  const res = await put.data;
  return res;
}

export const getAllProductsByStoreId = (storeId) => {
  
}

export const userIdFromToken = async (token) => {
  if (token) {
    const user = await axios.post(`/api/users/getByToken/`, {token: token});
    console.log('getUser')
    console.log(user)
    return user;
  } else {
    return 'no token entered'
  }
}

export const checkIfLoggedIn = async (userId) => {
    console.log("logged in in cookies")
      console.log("userToken in cookies")
        if (userId) {
          const getUserData = await axios.get(`/api/users/${userId}`);
          const userData = await getUserData.data.user;
          if (userData) {
            return [{userData:userData}, true]
          }
        }
        return true
}

export const usernameFromEmail = async (email) => {
  const emailParts = email.split('@');
  return emailParts[0];
}