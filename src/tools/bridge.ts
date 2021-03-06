var clientType, isAppClient;
var cookie = document.cookie;
var ua = window.navigator.userAgent.toLowerCase();
var Bridge = {};

if (ua.match(/ua_ps_ios/i) || cookie.match(/PSClient=ios/i)) {
  clientType = "ios";
  isAppClient = true;
} else if (ua.match(/ua_ps_android/i) || cookie.match(/PSClient=android/i)) {
  clientType = "android";
  isAppClient = true;
} else {
  clientType = "browser";
  isAppClient = false;
}

function setupWebViewJavascriptBridge(callback) {
  //Android使用
  if (window["WebViewJavascriptBridge"]) {
    return callback(window["WebViewJavascriptBridge"]);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function() {
        callback(window["WebViewJavascriptBridge"]);
      },
      false
    );
  }
  if (window["WVJBCallbacks"]) {
    return window["WVJBCallbacks"].push(callback);
  }
  window["WVJBCallbacks"] = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

function commonCallHandler(action, data, callBack) {
  setupWebViewJavascriptBridge(function(bridge) {
    bridge.callHandler(action, JSON.stringify(data), callBack);
  });
}

//注册回调方法
// function commonRegisterHandler(action, callBack) {
//   setupWebViewJavascriptBridge(function (bridge) {
//     bridge.registerHandler(action, function (data, responseCallback) {
//       window[action](data)
//       callBack(data)
//       responseCallback("success")
//     })
//   })
// }

//去登录
Bridge["goLogin"] = function(data = {}, callBack) {
  if (!isAppClient) {
    window.location.href = "/#/login";
  } else {
    commonCallHandler("goLogin", data, callBack);
  }
};

//获取用户登录信息
Bridge["getUserLoginInfo"] = function(data = {}) {
  return new Promise((resolve, reject) => {
    let callBack = data => {
      window.sessionStorage.setItem("loginInfo", data);
      resolve(true);
    };
    commonCallHandler("getUserLoginInfo", data, callBack);
    if (!isAppClient) {
      // callBack('{}')204
      //prepro '{"appVersion":"2.0.0","appsflyId":"1545632910295-1799901981462004906","areaCode":"55","clientId":"ffe08f7c79a57a893ea7792708ca9038","cpf":"41201296838","deviceId":"81aacc05a80860166e0b1209bba04a42","deviceType":"DUK-AL20","educationBackground":0,"email":"chuminghua@adpanshi.com","gender":0,"id":156,"latitude":"30.339138037237685","loanPurpose":0,"longitude":"120.10760467586562","maritalStatus":0,"phoneNumber":"14812341234","residentialDuration":0,"token":"77fa44ce-c856-46eb-bd4e-2e688def438a","vest":"1"}'
      callBack(
        '{"appVersion":"2.0.0","appsflyId":"ddddddd","areaCode":"62","birthday":"390499200000","block":"fhu","city":"ggjh","clientId":"71c6303111d6ffbd0013ffa1c0c8a9b5","createTime":"1553673478000","deviceId":"b75431ed035c491089f84b5517c26f47","deviceType":"SM-J701MT","educationBackground":2,"email":"fuhcf","gender":"PEREMPUAN","id":521,"idNumber":"7105074205820001","latitude":"0.0","loanPurpose":0,"longitude":"0.0","maritalStatus":2,"modifyTime":"1553675904000","motherName":"dghvvb","phoneNumber":"188425004166","residentialDuration":4,"token":"3535dbab-253d-492b-91f4-e92f2c161126","usernameShort":"JELTY JEINE KORDAK","vest":"1"}'
      );
    }
  });
};

//返回上一页
Bridge["goBack"] = function(data = {}, callBack) {
  commonCallHandler("goBack", data, callBack);
};

//打开相机
Bridge["openCamera"] = function(data = {}, callBack) {
  commonCallHandler("openCamera", data, callBack);
};
//打开OCR识别
Bridge["openOCR"] = function(data = {}, callBack) {
  commonCallHandler("openOCR", data, callBack);
};
//打开相册
Bridge["openGallary"] = function(data = {}, callBack) {
  commonCallHandler("openGallary", data, callBack);
};

//跳转主页
Bridge["goHome"] = function(data = {}, callBack) {
  commonCallHandler("goHome", data, callBack);
};

//跳转忘记密码页面
Bridge["forgetLoginPw"] = function(data = {}, callBack) {
  commonCallHandler("forgetLoginPw", data, callBack);
};

//跳转登录页面
Bridge["goLogin"] = function(data = {}, callBack) {
  commonCallHandler("goLogin", data, callBack);
};

//获取通讯录
Bridge["getContact"] = function(data = {}, callBack) {
  commonCallHandler("getContact", data, callBack);
};

//获取风控信息
Bridge["getDviceDetail"] = function(data = {}, callBack) {
  commonCallHandler("getDviceDetail", data, callBack);
};
//获取风控信息
Bridge["InstalledApp"] = function(data = {}, callBack) {
  commonCallHandler("InstalledApp", data, callBack);
};
//获取风控信息
Bridge["contactMess"] = function(data = {}, callBack) {
  commonCallHandler("contactMess", data, callBack);
};
//获取风控信息
Bridge["getHardwareMess"] = function(data = {}, callBack) {
  commonCallHandler("getHardwareMess", data, callBack);
};
//获取风控信息
Bridge["getCall"] = function(data = {}, callBack) {
  commonCallHandler("getCall", data, callBack);
};
//获取风控信息
Bridge["getSms"] = function(data = {}, callBack) {
  commonCallHandler("getSms", data, callBack);
};
//获取风控信息
Bridge["getNewCode"] = function(data = {}, callBack) {
  commonCallHandler("getNewCode", data, callBack);
};
//获取风控信息
Bridge["getCount"] = function(data = {}, callBack) {
  commonCallHandler("getCount", data, callBack);
};
//获取人脸识别
Bridge["uploadfaceNow"] = function(data = {}, callBack) {
  commonCallHandler("uploadfaceNow", data, callBack);
};
//复制
Bridge["copy"] = function(data = " ", callBack) {
  commonCallHandler("copy", data, callBack);
};

export default {
  clientType: clientType,
  isAppClient: isAppClient,
  ...Bridge
};
