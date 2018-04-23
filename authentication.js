'use strict';


const PSI_ROZA = {
  LOGIN: "9882974166",//"3554678395",
  HOST: "https://mobile.sberbank.ru:4457",
  HOST_BLOCK: "https://mobile.sberbank.ru:4459",
  SMS_PASS: "55098",
  mGUID: "f63cd8bd2ef93ee306c5de43266c5683",

  PASS: "11223",

};
console.log(133);

const GLOBALS = {
  DEVID: "09D4B172-B264-419A-BFBE-6EA7E02B6239",
  VERSION: "9",
  SMS_PASS: "55098",
  operation: "register",
  login: "6435488876",
  version: "9.10",
  appType: "5.5.0",
  deviceName: "Simulator",
  devID: "08D4B172-B264-419A-BFBE-6EA7E00B6239",
  mGUID: "27e5264de6bd37ba4fe37bea592099d4"
}
var XMLMapping = require('xml-mapping');

var iconv = require('iconv-lite');

var parse = require('xml-parser');
const axios = require('axios');


const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');
var Cookie = tough.Cookie;

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

var instance = axios.create({
  timeout: 30000,
  jar: cookieJar, // tough.CookieJar or boolean
  withCredentials: true,
  responseType:'stream',
  headers: {
    'Content-Language':'ru',
    'Accept-Language': 'ru;q=1',
    'Content-Type': 'text/xml;charset=windows-1251',
    'User-Agent': 'Mobile Device'
  }
});


var autpip = function(addr) {
  var promise = new Promise(function(resolve, reject) {
    instance.get(addr).then((res) => {      
      res.data.pipe(iconv.decodeStream("win1251")).collect((err, body) => {
        resolve(body);
      });
    }).catch(err => {
      console.log("Error from autopip");
      reject(err)
    })
  });

  return promise.then(res => {
    return res
  }).catch(err => {
    throw new Error("Connection error")
  })
};

//////////////////REGISTRATION////////////////////////////////////////
// var reg = function(){
//   var self = this;
//     try{
//   return autpip.call(self,PSI_ROZA.HOST +
//     '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
//     '&version=' + GLOBALS.VERSION +
//     '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
//     GLOBALS.DEVID).then(res=>{
//       var obj = parse(res);
//       var mGUID= obj['root']['children'][2]['children'][0]['content'];
//       console.log("mguid = "+mGUID);
//       return mGUID
//     }).then(mGUID=>{
//       return autpip.call(self,PSI_ROZA.HOST +
//         "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
//         mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
//         ".10&appType=iPhone").then(()=>{
//           console.log("mguid = "+mGUID);
//           return mGUID;
//         }).catch(res => {
//           console.log('catch3'+res);
//           self.emit(':tell', 'Connection error, restart the skill ');

//           });

//     //  console.log(res);

//   }).then(mGUID=>{

//      return autpip.call(self,PSI_ROZA.HOST +
//       "/CSAMAPI/registerApp.do?operation=createPIN&mGUID=" +
//       mGUID + "&password=" + PSI_ROZA.PASS + "&version=" + GLOBALS.VERSION +
//       ".10&appType=iPhone" +
//       "&appVersion=5.5.0&deviceName=Simulator&isLightScheme=false&devID=" +
//       GLOBALS.DEVID + "&mobileSdkData=1").then(res=>{
//         var obj = parse(res);
//         var token = obj['root']['children'][2]['children'][1]['content'];
//         console.log("token = "+token);
//         return token;
//       }).catch(res => {
//         console.log('catch4'+res);
//         self.emit(':tell', 'Connection error, restart the skill ');

//       return res;
//                     // reject(0);
//                     //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
//                   });
//   //  console.log(res);
// }).then(token=>{

//   return autpip.call(self,PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
//     "/postCSALogin.do?token=" + token).then(res=>{
//       var obj = parse(res);
//       var status  = obj['root']['children'][0]['children'][0]['content'];
//       console.log(obj['root']['children'][0]['children'][0]);
//       console.log("status "+status);
//       if(parseInt(status)!==0) throw new Error('Login error');
//     }).catch(res => {
//         conn = null;
//       console.log('catch31'+res);
//       this.emit(':tell', 'Connection error, restart the skill ');
//     });


//   //console.log(token);
// }).catch(res => {
//   console.log('catch5'+res);
//   this.emit(':tell', 'Connection error, restart the skill ');

// return res;
// });

// } catch (err) {
//   this.emitWithState('NewSession');

// console.log('catch30'+err);
//   // обработка ошибки

// }
// };
////////////////////END REGISTRATION////////////////////////////////////


var auth = function(){return autpip(PSI_ROZA.HOST+
  '/CSAMAPI/login.do?operation=button.login&mGUID='+PSI_ROZA.mGUID+
  '&password='+PSI_ROZA.PASS+'&version='+GLOBALS.version+
'&appType=iPhone&appVersion='+GLOBALS.appType+
'&deviceName=Android&isLightScheme=false&devID='+GLOBALS.DEVID+'&mobileSdkData=sdf')
.then(res=>{
  var obj  = XMLMapping.load(res);
  console.log(obj);
  var token = obj.response.loginData.token.$t;
  console.log("token = "+token);
  return token;
})
.then(token=>{
    return autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
      "/postCSALogin.do?token=" + token).then(res=>{

        var obj  = XMLMapping.load(res);
       // console.log(res);
        
        
        let status = obj.response.status.code.$t;
        console.log('status postCSAlogin = '+status);
        

        if(status!=='0') throw new Error('error token'); 
        console.log(obj.response.person.surName.$t);
        return status;
      }).catch(res => {
        console.log('catch31'+res);
        //this.emit(':tell', 'Connection error, restart the skill ');
      });
  
})
};

module.exports.auth = auth;
module.exports.autpip = autpip;
module.exports.PSI_ROZA = PSI_ROZA;
module.exports.GLOBALS = GLOBALS;