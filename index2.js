
'use strict';
const PSI_ROZA = require('./authentication').PSI_ROZA;
const GLOBALS = require('./authentication').GLOBALS;
var USE_IMAGES_FLAG = true;

function getCardTitle() { return "cardtitle";}
function cardTitle() { return "cardtitle";}


var auth = require('./authentication').auth;
var autpip = require('./authentication').autpip;

var history4_12 = require('./data').history4_12;
var diag4_11_6 = require('./data').diag4_11_6;
var financial_calendar_4_11_7 = require('./data').financial_calendar_4_11_7;
var financial_calendar_ofday_4_11_8 = require('./data').financial_calendar_ofday_4_11_8;

var XMLMapping = require('xml-mapping');

var date = require('./calendar');
var calendar = new date();

//var getSuccess = require('./functions').getSuccess;
var getSuccess ={
  crip: function(n){
    return n>1?true:false;
  }
}

console.log(getSuccess.crip(1))
auth().then(() => {
  //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
    return autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
    "/private/graphics/finance.do").then((res) => {
      let obj  = XMLMapping.load(res);

      //let arr = financial_calendar_ofday_4_11_8(obj);
        let rr = diag4_11_6(obj);
      console.log(rr.cards)
      // console.log(rr.accounts)
      // console.log(rr.imaccounts)



    }).catch((res) => {

    console.log('catch1qq'+res);
    throw new Error("catch from history")
  });
}).catch((res) => {
  
      console.log('catch1ww'+res);
    });

/*
auth().then(() => {
  //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
    return autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
    "/private/finances/financeCalendar/showSelected.do?onDate=03.03.2017&selectedCardIds=567758"
    ).then((res) => {
      let obj  = XMLMapping.load(res);
      //console.log(obj)
      let arr = financial_calendar_ofday_4_11_8(obj);

      console.log(arr)

    }).catch((res) => {

    console.log('catch1'+res);
    throw new Error("catch from history")
  });
}).catch((res) => {
  
      console.log('catch1'+res);
    });

/*
auth().then(() => {
  //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
    return autpip(
      PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
      "/private/finances/financeCalendar/show.do?operation"+
      "=filter&onDate=03.2017&showCash=true&showCashPayments=true"
    ).then((res) => {
      let obj  = XMLMapping.load(res);

      //console.log(obj.response.financeCalendar.calendarDay);

      let arr1 = obj.response.financeCalendar.calendarDay;
     

      let arr2 = financial_calendar_4_11_7(arr1);
      var str = '';
      arr2.forEach(function(item, i) {

        console.log(i+1+") "+item.income+" | "+ item.outcome+ " | " + item.date);// //+item.to+" | "+ item.description + " | " + item.date+ " | " + item.amount + " " + item.currency)
       //str +=i+1+") "+item.outcome+" | "+ item.outcome + " | " + item.date+"<br/>";

      });
     //console.log(str)
    }).catch((res) => {

    console.log('catch1'+res);
    throw new Error("catch from history")
  });
}).catch((res) => {
  
      console.log('catch1'+res);
    });
   */

   /*
auth().then(() => {
  //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
    return autpip(
      PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
      "/private/payments/list.do?from=03.03.2017"+
      "&to=03.03.2017"+
      "&paginationSize=2000&paginationOffset=0"
    ).then((res) => {
      let obj  = XMLMapping.load(res);


      console.log(undefined==obj.response.operations)
      let arr1 = obj.response.operations.operation;
      
     

      let arr2 = history4_12(arr1);
      var str = '';
      arr2.forEach(function(item, i) {
        console.log(i+1+") "+item.description);// //+item.to+" | "+ item.description + " | " + item.date+ " | " + item.amount + " " + item.currency)
       str +=i+1+") "+item.to+" | "+ item.description + " | " + item.date+ " | " + item.amount + " " + item.currency+"<br/>";

      });

    }).catch((res) => {

    console.log('catch1'+res);
    throw new Error("catch from history")
  });
}).catch((res) => {
  
      console.log('catch1'+res);
    });

*/
function isEmpty(obj,val) {
    if(obj[val]!==undefined){ return true;}else{ return false; }
};


