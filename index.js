'use strict';//1
const PSI_ROZA = require('./authentication').PSI_ROZA;
const GLOBALS = require('./authentication').GLOBALS;

var color = require('./functions').color;
var getSuccess = require('./functions').getSuccess;
var unique = require('./functions').unique;
var unique2 = require('./functions').unique2;
var compareNumeric = require('./functions').compareNumeric;

var auth = require('./authentication').auth;
var autpip = require('./authentication').autpip;

var Quiche = require('quiche');
var pie = new Quiche('pie');


var Alexa = require("alexa-sdk");

var diag4_11_6 = require('./data').diag4_11_6;
var history4_12 = require('./data').history4_12;
var financial_calendar_4_11_7 = require('./data').financial_calendar_4_11_7;
var financial_calendar_ofday_4_11_8 = require('./data').financial_calendar_ofday_4_11_8;

var XMLMapping = require('xml-mapping');

const axios2 = require('axios');

var date = require('./calendar');
var calendar = new date();
var moment = require('moment');

var getDate = require('./getDate');


exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  //alexa.dynamoDBTableName = 'MyTable';
  alexa.registerHandlers(newSessionHandlers, startGameHandlers);
  alexa.execute();
};



var states = {
  GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
  STARTMODE: '_STARTMODE', // Prompt the user to start or restart the game.
  ENDMODE: '_ENDMODE'
};
//var conn =  connect();
var conn = null;

var newSessionHandlers = {
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    var message = ' There are five actions, such as : 1st, get data for financial calendar  for date your date,' +
      ' second, get data for transaction history as list for interval from date to date , ' +
      'third, get data for transaction history for interval from date to date, fourth, show diagram of accounts, cards or imaccounts. ' +
      'For some queries navigation is possible. Using the phrase,  navigation next, last, first or previous';
    this.emit(':ask', message, message);
  },
  "AMAZON.StopIntent": function () {
    console.log("STOPINTENT");
    this.emitWithState('Exit');
  },
  "AMAZON.CancelIntent": function () {
    console.log("CANCELINTENT");
    this.emitWithState('Exit');

  },
  'Exit': function () {
    this.handler.state = '';
    var response = {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> " + "Goodbye! The skill will be restarted " + "</speak>"
        },
        "card": {
          "content": "",
          "title": "Goodbye! The skill will be restarted ",
          "type": "Simple"
        },
        "speechletResponse": {

          "shouldEndSession": true
        }
      },
      "sessionAttributes": {

      }
    };
    console.log(response);
    this.context.succeed(response);
  },
  'NewSession': function () {
    conn = null;
    //this.attributes['status']=false;
    // conn = reg();
    this.handler.state = states.STARTMODE;
    ///this.emit(':saveState', true);
    var message = "Welcome 1 to bank account checker. First, connect to the server by saying the word connect, and then say the call phrase for the desired action."
    this.emit(':ask', message, message);
    //'Say yes to start the game or no to quit.
  },

  'Unhandled': function () {
    //this.emitWithState('')
    this.emit('NewSession');
  }
};




var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'AMAZON.HelpIntent': function () {
    var message = ' There are five actions, such as : 1st, get data for financial calendar  for date your date,' +
      ' second, get data for transaction history as list for interval from date to date , ' +
      'third, get data for transaction history for interval from date to date, fourth, show diagram of accounts, cards or imaccounts.' +
      'For some queries navigation is possible. Using the phrase,  navigation next, last, first or previous';
    this.emit(':ask', message, message);
  },
  "AMAZON.StopIntent": function () {
    console.log("STOPINTENT");
    this.emitWithState('Exit');
  },
  "AMAZON.CancelIntent": function () {
    console.log("CANCELINTENT");
    this.emitWithState('Exit');

  },
  'Exit': function () {
    this.handler.state = '';
    var response = {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> " + "Goodbye! The skill will be restarted " + "</speak>"
        },
        "card": {
          "content": "",
          "title": "Goodbye! The skill will be restarted ",
          "type": "Simple"
        },
        "speechletResponse": {

          "shouldEndSession": true
        }
      },
      "sessionAttributes": {

      }
    };
    console.log(response);
    this.context.succeed(response);
  },
  'NewSession': function () {
    this.handler.state = '';
    var response = {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> " + "connecting error. Say the word connect " + "</speak>"
        },
        "card": {
          "content": "",
          "title": "connecting error. Say the word connect ",
          "type": "Simple"
        },
        "speechletResponse": {

          "shouldEndSession": false
        }
      },
      "sessionAttributes": {
        "STATE": "_STARTMODE"

      }
    };
    console.log(response);
    this.context.succeed(response);
  },


  'testIntent': function () {
    var self = this;
    autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
      "/private/payments/list.do?from=08.11.2018" +
      "&to=31.03.2019" +
      "&paginationSize=20&paginationOffset=0")
      .then((res) => {
        self.emit(":ask", "success");
        console.log('success');
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        self.emit(":ask", "failed");
      });

  },

  'DiagramBar': function () {
    var sentence = [];
    sentence.push("Each column corresponds to each translation");
    sentence.push("Each column corresponds to all translations in one day");
    sentence.push("Each column corresponds to all translations in one month");
    var phrase = sentence[0];
    var self = this;


    console.log(this.attributes['status']);

    if ((this.attributes['request'] == '4117') || (this.attributes['request'] == '4118'))
      this.emit(":ask", "Don't work for this request", "Don't work for this request");

    var slotValuefrom = this.event.request.intent.slots.datefrom.value || this.attributes['slotValuefrom'] || null;
    var slotValueto = this.event.request.intent.slots.dateto.value || this.attributes['slotValueto'] || null;
    var slotDate = this.event.request.intent.slots.date.value || null;
    var sortval = this.event.request.intent.slots.sort.value || null;

    console.log(">>> " + slotValuefrom + " : " + slotValueto + " : " + slotDate);
    // console.log(slotValuefrom+" to "+slotValueto);

    var arr = getDate.call(this, this.attributes['startstr'], this.attributes['endstr'], slotValuefrom, slotValueto, slotDate);
    this.attributes['slotValuefrom'] = undefined;
    this.attributes['slotValueto'] = undefined;

    this.attributes['startstr'] = arr[0];
    this.attributes['endstr'] = arr[1];
    if (slotDate) {
      this.attributes['onmonth'] = arr[2];
      this.attributes['ondate'] = arr[1];
    } else {
      this.attributes['onmonth'] = undefined;
      this.attributes['ondate'] = undefined;
    }



    auth().then(() => {
      //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
      return autpip(
        PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
        "/private/payments/list.do?from=" +
        this.attributes['startstr'] + "&to=" + this.attributes['endstr'] +
        "&paginationSize=1000000&paginationOffset=0").then((res) => {
          let obj = XMLMapping.load(res);
          if (undefined==obj.response.operations)this.emit(':tell', "no data");

          let arr1 = obj.response.operations.operation;

          let arr2 = history4_12(arr1);
          var shuffledMultipleChoiceList = [];

          arr2.forEach(function (item, i) {
            shuffledMultipleChoiceList.push({
              "date": item.date,
              "amount": item.amount
            })
          });

          shuffledMultipleChoiceList = (function () {
            if (shuffledMultipleChoiceList.length > 100 && self.attributes['startstr'] !== self.attributes['endstr']) {
              phrase = sentence[1];
              console.log(">100");
              var positive = shuffledMultipleChoiceList.filter(function (item) {
                return item.amount > 0;
              });
              var negative = shuffledMultipleChoiceList.filter(function (item) {
                return item.amount < 0;
              });
              console.log(positive.length);
              var sortNeg = unique(negative);
              //console.log(sortNeg.length);
              var sortPos = unique(positive);
              if ((Object.keys(sortNeg).length + Object.keys(sortPos).length) > 100) {
                phrase = sentence[2];
                console.log("2 >100");
                sortPos = unique2(sortPos);
                sortNeg = unique2(sortNeg);
                shuffledMultipleChoiceList = [];
                for (var variable in sortPos) {
                  shuffledMultipleChoiceList.push({
                    "date": variable,
                    "amount": sortPos[variable]
                  })
                };
                for (var variable in sortNeg) {
                  shuffledMultipleChoiceList.push({
                    "date": variable,
                    "amount": sortNeg[variable]
                  })
                }

                return shuffledMultipleChoiceList
              } else {
                shuffledMultipleChoiceList = [];
                for (var variable in sortPos) {
                  shuffledMultipleChoiceList.push({
                    "date": variable,
                    "amount": sortPos[variable]
                  })
                };
                for (var variable in sortNeg) {
                  shuffledMultipleChoiceList.push({
                    "date": variable,
                    "amount": sortNeg[variable]
                  })
                }

                return shuffledMultipleChoiceList
              }

            } else {
              //console.log(shuffledMultipleChoiceList);
              return shuffledMultipleChoiceList;
            }
          })();

          console.log(shuffledMultipleChoiceList);

          console.log(shuffledMultipleChoiceList.length);

          if (shuffledMultipleChoiceList.length == 0) {
            this.emit(':ask', "no results for this date", "no results for this date");
          };




          if ((shuffledMultipleChoiceList[0].date.split(".").length - 1) == 2) {
            shuffledMultipleChoiceList.sort(function (a, b) {

              if (moment(a.date, "DD.MM.YYYY") > moment(b.date, "DD.MM.YYYY")) {
                return 1
              } else {
                return -1
              }

            });
          } else {
            console.log("else");
            shuffledMultipleChoiceList.sort(function (a, b) {

              if (moment("01." + a.date, "DD.MM.YYYY") > moment("01." + b.date, "DD.MM.YYYY")) {
                return 1
              } else {
                return -1
              }

            });
          };
          //console.log(shuffledMultipleChoiceList);
          //


          shuffledMultipleChoiceList.reduce(function (previousValue, currentItem, index) {

            if (previousValue.date.trim() == currentItem.date) {
              currentItem.date = previousValue.date + " ";
              //console.log("currentItem.date = "+currentItem.date+" previousValue.date = "+ previousValue.date);
            };
            return currentItem
          });
          if (sortval == "value") {
            shuffledMultipleChoiceList.sort(function (a, b) {

              if (a.amount > b.amount) {
                return 1
              } else {
                return -1
              }

            });
          };


          //
          // shuffledMultipleChoiceList.reduce(function(previousValue, currentItem, index) {
          //   if (previousValue.date == currentItem.date) {
          //     console.log("currentItem.date = "+currentItem.date+" previousValue.date = "+ previousValue.date);
          //   };
          // });



          console.log("///////////////////////////////////////////////");
          shuffledMultipleChoiceList.forEach(item => console.log(item));

          axios2.post('https://google-chart.herokuapp.com/rr', shuffledMultipleChoiceList).then(function (res) {
            console.log("AxiosstatusCode: " + res.status); // <======= Here's the status code
            // console.log("headers: ", res.headers);

            if (res.status == 200) {

              console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
              console.log(res.data);
              var seconds = new Date().getTime();
              var imageUrl = 'https://google-chart.herokuapp.com/ff?' + seconds;

              var content = {
                "hasDisplaySpeechOutput": "The chart was built. " + phrase,
                "hasDisplayRepromptText": "The chart was built" + phrase,
                "simpleCardTitle": '',
                "simpleCardContent": '',
                "bodyTemplateTitle": '',
                "bodyTemplateContent": '',
                "templateToken": "factBodyTemplate",
                "askOrTell": ":ask",
                "imageUrl": imageUrl,
                "sessionAttributes": {
                  "STATE": states.STARTMODE,
                  "status": true,
                  "startstr": self.attributes['startstr'],
                  "endstr": self.attributes['endstr']

                }
              };


              renderTemplate2.call(self, content);

            } else {
              this.emit(':tell', "some error");
            }

          }).catch((res) => {
            this.emit(':tell', "error ");

          });





        }).catch((res) => {
          console.log('catch10-1(sorry5)' + res);
          this.attributes['status'] = false;
          self.emit(":ask", "tell word connect first", "tell word connect first");

        });
    }).catch((res) => {
      console.log('catch12-2' + res);
      this.attributes['status'] = false;
      self.emit(":tell", "connection error ", "connection error");

    });



  },




  'DiagramIntent': function () {

    var self = this;

    var value = this.event.request.intent.slots.dg.value;
    console.log(" value  - " + value);
    if (value === null)
      this.emit(':ask', "You must say cards, accounts or imaccounts ", "You must say cards, accounts or imaccounts ");

    var promise = new Promise(function (resolve, reject) {

      //var value = this.event.request.intent.slots.dg.value || null;


      auth().then(() => {

        return autpip.call(this, PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
          "/private/graphics/finance.do"
        ).then((res) => {
          let obj  = XMLMapping.load(res);
          let arr4_11_6 = diag4_11_6(obj);


          var str = "";
          var s = "";
          var shuffledMultipleChoiceList = [];

          //var dg = true;

          if (typeof value == 'undefined') self.emit(':ask', "You must say cards, accounts or imaccounts", "You must say cards, accounts or imaccounts");
          switch (value) {
            case "imaccounts":
              var dg = 'imaccounts';
              break;
            case "accounts":
              var dg = 'accounts';
              break;
            case "cards":
              var dg = 'cards';
              break;
            default:
              var dg = false;
              break;
          }
          console.log("dg = " + dg);
          if (!dg) {
            console.log("!dg !!!!!!!");
            self.emit(':ask', "You must say cards, accounts or imaccounts, not " + value, "You must say cards, accounts or imaccounts, not  " + value);


          }

          var arr2 = arr4_11_6[dg];
          console.log(arr2);
          this.emit(':tell', "Thanks for playing, goodbye");



          var arr = [];
          pie.setTransparentBackground();
          pie.addPercent();

          arr2.sort(compareNumeric);
          arr2.reverse();
          if (arr2.length < 20) {

            for (var i = 0; i < arr2.length; i++) {
              var ttt = arr2[i].balance;
              console.log(ttt);
              pie.addData(ttt, "id = " + arr2[i].id + " ", color());
              arr.push(ttt);

              // shuffledMultipleChoiceList.push(arr2[i].id + " | balance = " + arr2[i].balance + " ₽");
              console.log(arr2[i].id + " | balance = " + arr2[i].balance + " ₽");
            };


            pie.setLabel(arr);
            var Url = pie.getUrl(true);
            pie = new Quiche('pie');
            resolve(Url);
          } else {
            for (var i = 0; i < arr2.length; i++) {
              var ttt = arr2[i].balance.replace(/\s/g, "");
              shuffledMultipleChoiceList.push({
                "date": "id " + arr2[i].id,
                "amount": parseInt(ttt)
              });
            };

            axios2.post('https://google-chart.herokuapp.com/rr', shuffledMultipleChoiceList).then(function (res) {
              console.log("AxiosstatusCode: " + res.status); // <======= Here's the status code
              // console.log("headers: ", res.headers);

              if (res.status == 200) {
                var seconds = new Date().getTime();
                var imageUrl = 'https://google-chart.herokuapp.com/ff?' + seconds;
                resolve(imageUrl);

              }
            });


          }

        })
          .catch(res => {
            console.log('catch6' + res);

            this.emit(':tell', "some error");

            // reject(0);
            //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
          });

      }).catch(res => {
        console.log('catch7' + res);

        this.emit(':tell', "some error");
        reject(res)
        // reject(0);
        //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
      });
    });


    promise.then(res => {

      var content = {
        "hasDisplaySpeechOutput": "The chart was built ",
        "hasDisplayRepromptText": "The chart was built",
        "simpleCardTitle": '',
        "simpleCardContent": '',
        "bodyTemplateTitle": '',
        "bodyTemplateContent": '',
        "templateToken": "factBodyTemplate",
        "askOrTell": ":ask",
        "imageUrl": res,
        "sessionAttributes": {
          "STATE": states.STARTMODE
        }
      };
      renderTemplate2.call(this, content);


    }).catch(res => {
      this.emit(':tell', "some error");
      console.log('catch8' + res);

    });



  },




  'NavigationIntent': function () {

    var countitems = this.attributes['countitems'];
    var request = this.attributes['request'];
    if (typeof request == 'undefined') this.emit(':ask', "Don't understand request. Repeat please", "Don't understand request. Repeat please");

    if (typeof this.attributes['countitems'] == 'undefined') {
      this.emit(':ask', "The number of elements is zero ", "The number of elements is zero ")
    }
    if (typeof this.attributes['currentpage'] == 'undefined') {
      var currentpage = 0;
    } else {
      var currentpage = this.attributes['currentpage']
    };
    var countpages = Math.ceil(parseInt(countitems) / 50);
    console.log("countpages = " + countpages);

    var value = this.event.request.intent.slots.index.value;
    switch (value) {
      case "next":

        if (currentpage + 1 < countpages)
          currentpage = currentpage + 1
        console.log("currentpage = " + currentpage);
        break;
      case "previous":

        if (currentpage - 1 != -1)
          currentpage = currentpage - 1;
        console.log("currentpage = " + currentpage);
        break;
      case "last":
        if (countpages - 1 != -1)
          currentpage = countpages - 1;
        console.log("currentpage = " + currentpage);
        break;
      case "1st":
        currentpage = 0;
        console.log("currentpage = " + currentpage);
        break;

      default:
        this.emit(':ask', "repeat navigation request", "repeat navigation request");
        break;
    }
    var str = "";


    switch (request) {
      case '412astext':
        if ((typeof this.attributes['startstr'] == 'undefined') || (typeof this.attributes['endstr'] == 'undefined')) { this.emit(':ask', "Repeat date", "Repeat date"); }
        var reqstr = PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
          "/private/payments/list.do?from=" +
          this.attributes['startstr'] + "&to=" + this.attributes['endstr'] +
          "&paginationSize=100000&paginationOffset=0";

        break;
      case '4118':
        if (typeof this.attributes['ondate'] == 'undefined') { this.emit(':ask', "sorry", "sorry"); }
        var reqstr = PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
          "/private/finances/financeCalendar/showSelected.do?onDate=" + this.attributes['ondate'] + "&selectedCardIds=567758";

        break;
      default:
        this.emit(':ask', "dont work for this ", "dont work for this ");

    }


    auth().then(() => {
      return autpip(reqstr).then((res) => {
        let obj = XMLMapping.load(res);



        switch (request) {
          case '412astext':
            let arr1 = obj.response.operations.operation;
            var arr412 = history4_12(arr1);
            var str = '';
            arr412.forEach(function (item, i) {
              if ((i >= currentpage * 50) && (i < currentpage * 50 + 50)) {
                str += i + 1 + ") " + item.to + " | " + item.description + " | " + item.date + " | " + item.amount + " " + item.currency + "<br/>";
              }
            });

            var buf1 = currentpage * 50;
            var buf2 = currentpage * 50 + 50;
            var hasDisplaySpeechOutput = getSuccess(countitems != 0) + ", " + 'Payments:' + buf1 + '...' + buf2 + ' of ' + countitems + " items";
            var hasDisplayRepromptText = getSuccess(countitems != 0);
            var simpleCardTitle = "History of operations";
            var simpleCardContent = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", from " + this.attributes['startstr'] + " to " + this.attributes['endstr'];
            var bodyTemplateTitle = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", from " + this.attributes['startstr'] + " to " + this.attributes['endstr'];

            break;

          case '4118':
            var arr_4_11_8 = financial_calendar_ofday_4_11_8(obj);
          
          var str = '';
          arr_4_11_8.forEach(function (item, i) {
            if ((i >= currentpage * 50) && (i < currentpage * 50 + 50)) {
              str += i + 1 + ") " + item.categoryName + " | " + item.description + " | " + item.amount + " RUB<br/>";
            }
          });

            var buf1 = currentpage * 50;
            var buf2 = currentpage * 50 + 50;
            var simpleCardTitle = "Receipt of a financial calendar statement for the day";
            var hasDisplaySpeechOutput = getSuccess(countitems != 0) + " Receipt of a financial calendar statement for the day " + ", " + arr_4_11_8.length + " items for " + this.attributes['ondate'];

            var hasDisplayRepromptText = getSuccess(countitems != 0);
            var simpleCardContent = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", for " + this.attributes['ondate'];
            var bodyTemplateTitle = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", for " + this.attributes['ondate'];


            break;

          default:
            this.emit(':ask', "dont work for this", "dont work for this");
        }
        //  if((parseInt(item.amount)!=0)&&(!isNaN(parseInt(item.amount)))){




        console.log(countitems);

        var content = {
          "hasDisplaySpeechOutput": hasDisplaySpeechOutput,
          "hasDisplayRepromptText": hasDisplayRepromptText,
          "simpleCardTitle": simpleCardTitle,
          "simpleCardContent": simpleCardContent,
          "bodyTemplateTitle": bodyTemplateTitle,
          "bodyTemplateContent": str,
          "templateToken": "factBodyTemplate",
          "askOrTell": ":ask",
          "sessionAttributes": {
            "STATE": states.STARTMODE,
            "request": this.attributes['request'],
            "countitems": countitems,
            //"myobj":shuffledMultipleChoiceList,
            "startstr": this.attributes['startstr'],
            "endstr": this.attributes['endstr'],
            'ondate': this.attributes['ondate'],
            'onmonth': this.attributes['onmonth'],
            'currentpage': currentpage//,
            //'readstr':readstr                     //'bodyTemplateContent':str
          }
        };

        renderTemplate.call(this, content);

      })
        .catch((res) => {
          this.emit(':tell', 'some error, sorry ');
          console.log('catch13 from navigation' + res);
          // reject(0);
          //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
        });
    }).catch((res) => {
      this.emit(':tell', 'some error, sorry ');
      console.log('catch1 from navigation' + res);
    });
  },

  'SayIntent': function () {

    var str = " ";
    var str2 = "";
    var currentpage = this.attributes['currentpage'];
    var request = this.attributes['request'];
    var countitems = this.attributes['countitems'];
    // var slotValue = this.event.request.intent.slots.read.value||"";
    // if (slotValue != 'read') {
    //   console.log("slotValue : " + slotValue);
    //   this.emit(':ask', "Don't understand request. Repeat please", "Don't understand request. Repeat please");
    // }
    if (typeof request == 'undefined') this.emit(':ask', "Don't understand request. Repeat please", "Don't understand request. Repeat please");


    switch (request) {
      case '412astext':


        if ((typeof this.attributes['startstr'] == 'undefined') || (typeof this.attributes['endstr'] == 'undefined')) { this.emit(':ask', "no date", "no date"); }
        var reqstr = PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
        "/private/payments/list.do?from=" +
        this.attributes['startstr'] + "&to=" + this.attributes['endstr'] +
        "&paginationSize=100000&paginationOffset=0";

        break;
      case '4118':
        if (typeof this.attributes['ondate'] == 'undefined') {
          this.emit(':ask', "no date", "no date");
        }
        var reqstr = PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
          "/private/finances/financeCalendar/showSelected.do?onDate=" + this.attributes['ondate'] + "&selectedCardIds=567758";
        break;

      default:
        this.emit(':ask', "dont work for this", "dont work for this");

    }
    var tc = currentpage * 50 + 50;



    // try {
      // if(conn === null || conn === undefined){conn = reg.call(this);}
      auth().then(() => {
        //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
        return autpip(reqstr).then((res) => {

          let obj = XMLMapping.load(res);
          //console.log(obj.root);

          var shuffledMultipleChoiceList = [];

          var str = "";
          var str2 = "";
          //var readstr = [];
          var length;


          switch (request) {
            case '412astext':
            let arr1 = obj.response.operations.operation;
            var arr412 = history4_12(arr1);
            arr412.forEach(function (item, i) {

                if ((i >= currentpage * 50) && (i < currentpage * 50 + 50)) {
                  str += i + 1 + " " + item.to + " " + item.description + " | " + item.date  +  " | "+ item.amount + " "+ item.currency + "<br/>";

                  str2 += i + 1 + ", " + item.to  + ", " + item.description + ", " + item.date + ", " + item.amount + " " + item.currency  + ", next,";

                };
              });
              length = arr412.length;
              var hasDisplaySpeechOutput = getSuccess(countitems != 0) + ", " + 'Payments:' + buf1 + '...' + buf2 + ' of ' + countitems + " items";
              var hasDisplayRepromptText = getSuccess(countitems != 0);
              var simpleCardTitle = "History of operations";
              var simpleCardContent = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", from " + this.attributes['startstr'] + " to " + this.attributes['endstr'];
              var bodyTemplateTitle = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", from " + this.attributes['startstr'] + " to " + this.attributes['endstr'];
              break;
            case '4118':
            var arr_4_11_8 = financial_calendar_ofday_4_11_8(obj);
            length = arr_4_11_8.length;
            arr_4_11_8.forEach(function (item, i) {
                if ((i >= currentpage * 50) && (i < currentpage * 50 + 50)) {
                  str += i + 1 + " " + item.categoryName + " | " + item.amount + " RUB | " + item.description + "<br/>";
                  str2 += i + 1 + ", " + item.categoryName + ", " + item.amount + " RUB , " + item.description + ", next,";

                }
              });

              var buf1 = currentpage * 50;
              var buf2 = currentpage * 50 + 50;
              var simpleCardTitle = "Receipt of a financial calendar statement for the day";
              var hasDisplaySpeechOutput = getSuccess(countitems != 0) + " Receipt of a financial calendar statement for the day " + ", " + length + " items for " + this.attributes['ondate'];

              var hasDisplayRepromptText = getSuccess(countitems != 0);
              var simpleCardContent = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", for " + this.attributes['ondate'];
              var bodyTemplateTitle = 'Payments:' + buf1 + ' to ' + buf2 + ' of ' + countitems + ", for " + this.attributes['ondate'];


              break;


            default:
              this.emit(':ask', "dont work for this", "dont work for this");
          }
          //  if((parseInt(item.amount)!=0)&&(!isNaN(parseInt(item.amount)))){






          console.log(countitems);

          var content = {
            "hasDisplaySpeechOutput": str2,
            "hasDisplayRepromptText": hasDisplayRepromptText,
            "simpleCardTitle": simpleCardTitle,
            "simpleCardContent": simpleCardContent,
            "bodyTemplateTitle": bodyTemplateTitle,
            "bodyTemplateContent": str,
            "templateToken": "factBodyTemplate",
            "askOrTell": ":ask",
            "sessionAttributes": {
              "STATE": states.STARTMODE,
              "countitems": countitems,
              //"myobj":shuffledMultipleChoiceList,
              "startstr": this.attributes['startstr'],
              "endstr": this.attributes['endstr'],
              'ondate': this.attributes['ondate'],
              'onmonth': this.attributes['onmonth'],
              'currentpage': currentpage,
              'request': this.attributes['request'],
              'status': this.attributes['status']
              //,
              //'readstr':readstr                     //'bodyTemplateContent':str
            }
          };

          renderTemplate.call(this, content);

        })
          .catch((res) => {
            this.emit(':tell', 'some error, sorry ');
            console.log('catch13' + res);
            // reject(0);
            //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
          });
      }).catch((res) => {
        this.emit(':tell', 'some error, sorry ');
        console.log('catch1' + res);
      });


    // } catch (err) {
    //   this.attributes['status'] = false;
    //   this.emitWithState('NewSession');

    //   console.log('catch20' + err);
    //   // обработка ошибки

    // }


  },

  'HelloWorldIntent': function () {
    var self = this;



    var value = this.event.request.intent.slots.hi.value || this.attributes['value'];
    var slotValuefrom = this.event.request.intent.slots.datefrom.value || this.attributes['slotValuefrom'] || null;
    var slotValueto = this.event.request.intent.slots.dateto.value || this.attributes['slotValueto'] || null;
    var slotDate = this.event.request.intent.slots.date.value || null;
    this.attributes['value'] = value;
    // console.log(slotValuefrom+" to "+slotValueto);
    var arr = getDate.call(this, this.attributes['startstr'], this.attributes['endstr'], slotValuefrom, slotValueto, slotDate);
    this.attributes['slotValuefrom'] = undefined;
    this.attributes['slotValueto'] = undefined;

    this.attributes['startstr'] = arr[0];
    this.attributes['endstr'] = arr[1];
    if (slotDate) {
      this.attributes['onmonth'] = arr[2];
      this.attributes['ondate'] = arr[1];
    } else {
      this.attributes['onmonth'] = undefined;
      this.attributes['ondate'] = undefined;
    }



    console.log(this.attributes['startstr'] + " - " + this.attributes['endstr'] + " - " + this.attributes['onmonth'] + " - " +
      this.attributes['ondate'] + " - " + this.attributes['slotValuefrom'] + " - " + this.attributes['slotValueto']);
    //this.emit(":tell", this.attributes['startstr']+" - "+this.attributes['endstr']+" - "+ this.attributes['onmonth']+" - "+
    // this.attributes['ondate']+" - "+this.attributes['slotValuefrom']+" - "+ this.attributes['slotValueto']);
    this.attributes['slotValuefrom'] = undefined;
    this.attributes['slotValueto'] = undefined;
    switch (value) {

      case "financial calendar"://"request 4.11.7":
        if (typeof this.attributes['onmonth'] == 'undefined') { // Check if it's the first time the skill has been invoked
          this.emit(":ask", "repeat the single date", "repeat the single date");
          //this.attributes['onmonth'] = "03.2017";
        }



        auth().then(() => {
          //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
          return autpip(
            PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
            "/private/finances/financeCalendar/show.do?operation" +
            "=filter&onDate=03.2017&showCash=true&showCashPayments=true"
          ).then((res) => {
            let obj = XMLMapping.load(res);

            //console.log(obj.response.financeCalendar.calendarDay);

            let arr1 = obj.response.financeCalendar.calendarDay;


            let arr2 = financial_calendar_4_11_7(arr1);
            var str = '';
            arr2.forEach(function (item, i) {

              str += i + 1 + ") " + item.income + " | " + item.outcome + " | " + item.date + "<br/>";// //+item.to+" | "+ item.description + " | " + item.date+ " | " + item.amount + " " + item.currency)
              //str +=i+1+") "+item.outcome+" | "+ item.outcome + " | " + item.date+"<br/>";

            });

            var content = {
              "hasDisplaySpeechOutput": getSuccess(arr2.length != 0) + ", " + arr2.length + ", " + "items",
              "hasDisplayRepromptText": getSuccess(arr2.length != 0),
              "simpleCardTitle": value,
              "simpleCardContent": this.attributes['onmonth'],
              "bodyTemplateTitle": 'Payments' + this.attributes['onmonth'],
              "bodyTemplateContent": str,
              "templateToken": "factBodyTemplate",
              "askOrTell": ":tell",
              "sessionAttributes": {
                "STATE": states.STARTMODE,
                'onmonth': this.attributes['onmonth'],
                "countitems": arr2.length,
                'currentpage': 0,
                'request': '4117'
              }
            };

            renderTemplate.call(self, content);

          });

        }).catch(res => {
          this.emit(':ask', "some error", "some error");
          console.log('catch10' + res);
        });

        break;



      case "financial calendar of day"://"request 4.11.8":
        if (typeof this.attributes['ondate'] == 'undefined') { // Check if it's the first time the skill has been invoked
          this.emit(":ask", "repeat the single date", "repeat the single date");
          //this.attributes['ondate'] = "03.03.2017";
        }
        // try{

        auth().then(() => {

          return autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
            "/private/finances/financeCalendar/showSelected.do?onDate=" + this.attributes['ondate'] + "&selectedCardIds=567758"
          ).then((res) => {

            var obj = XMLMapping.load(res);
             var arr2 = financial_calendar_ofday_4_11_8(obj);

            var str = "";

            arr2.forEach(function (item, i) {
              if (i < 49) {
                str += i + 1 + ") " + item.categoryName + " | " + item.description + " | " + item.amount + " RUB<br/>";
              }
            });


            var content = {
              "hasDisplaySpeechOutput": getSuccess(arr2.length != 0) + " Receipt of a financial calendar statement for the day" + ", " + arr2.length + " items for " + this.attributes['ondate'],
              "hasDisplayRepromptText": getSuccess(arr2.length != 0),
              "simpleCardTitle": "Receipt of a financial calendar statement for the day",
              "simpleCardContent": 'Payments: 0...50 of ' + arr2.length + ", for " + this.attributes['ondate'],
              "bodyTemplateTitle": 'Payments: 0...50 of ' + arr2.length + ", for " + this.attributes['ondate'],
              "bodyTemplateContent": str,
              "templateToken": "factBodyTemplate",
              "askOrTell": ":ask",
              "sessionAttributes": {
                "STATE": states.STARTMODE,
                "countitems": arr2.length,
                'ondate': this.attributes['ondate'],
                'currentpage': 0,
                'request': '4118'             //'bodyTemplateContent':str
              }
            };

            renderTemplate.call(self, content);

          })
            .catch(res => {
              this.emit(':tell', 'some error, sorry ');
              console.log('catch11' + res);
              // reject(0);
              //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
            });
        }).catch(res => {
          this.emit(':tell', 'some error2, sorry ');
          console.log('catch32' + res);
          // reject(0);
          //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
        });

        break;
      case "transaction history as list"://"request 4.12 as list":
        // if ((typeof this.attributes['startstr'] == 'undefined') || (typeof this.attributes['endstr'] == 'undefined')) { // Check if it's the first time the skill has been invoked
        //   this.attributes['startstr'] = "8.11.2015";
        //   this.attributes['endstr'] = "31.3.2018";
        // }
        // try{
 

        auth().then(() => {


          return autpip(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
            "/private/payments/list.do?from=" +
            this.attributes['startstr'] + "&to=" + this.attributes['endstr'] +
            "&paginationSize=1000000&paginationOffset=0"
          ).then((res) => {

  
            let obj = XMLMapping.load(res);

            let arr1 = obj.response.operations.operation;
            var shuffledMultipleChoiceList = [];
            let arr2 = history4_12(arr1);
            arr2.forEach(function (item, i) {
              if (i < 49) {
                var str =item.to + " | " + item.description + " | " + item.date + " | " + item.amount + " " + item.currency;
                shuffledMultipleChoiceList.push(str);
              }
            });


            let listItems = shuffledMultipleChoiceList.map((name, i) => {
              return {
                "token": i + "tok",

                "textContent": {
                  "primaryText": {
                    "type": "RichText",
                    "text": "<font size='2'>" + name + "</font> "
                  }

                }
              }
            });




            var content = {
              "hasDisplaySpeechOutput": getSuccess(arr2.length != 0) + ", " + value + ", " + arr2.length + " items",
              "hasDisplayRepromptText": getSuccess(arr2.length != 0),//+"<break time=\'1s\'\/>"+value+"<break time=\'1s\'\/>"+,//+"<break time=\'1s\'\/> "+value+"<break time=\'1s\'\/> "++shuffledMultipleChoiceList.length +"<break time=\'1s\'\/> "+ "items",
              "noDisplaySpeechOutput": "",//getSuccess(shuffledMultipleChoiceList.length!=0),
              "noDisplayRepromptText": value,
              "simpleCardTitle": value,
              "simpleCardContent": "from " + this.attributes['startstr'] + " to " + this.attributes['endstr'] + " " + arr2.length + " items",
              "listTemplateTitle": "from " + this.attributes['startstr'] + " to " + this.attributes['endstr'],
              //"listTemplateContent" : getTextDescription(item),
              "templateToken": "MultipleChoiceListView",
              "askOrTell": ":ask",
              "listItems": listItems,
              "hint": "Add a hint here",
              "sessionAttributes": {
                "STATE": states.STARTMODE,
                "countitems": arr2.length,
                "startstr": this.attributes['startstr'],
                "endstr": this.attributes['endstr'],
                'currentpage': 0,//123
                'request': '412astext'
              }
            };


            renderTemplate.call(self, content);

          })
            .catch((res) => {
              this.emit(':tell', 'some error, sorry ');
              console.log('catch12' + res);
              // reject(0);
              //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
            });
        }).catch((res) => {

          console.log('catch33' + res);
        });;

        break;

      case "transaction history"://"request 4.12 as text":
        console.log("transaction history");
        //try {
        if (self.attributes['currentpage'] != undefined) console.log(self.attributes['currentpage']);
        auth().then(() => {
          //  {{HOST_BLOCK}}/mobile{{VERSION}}/private/payments/list.do?from=08.11.2010&to=31.03.2018&paginationSize=200&paginationOffset=0
          return autpip(
            PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
            "/private/payments/list.do?from=" +
            this.attributes['startstr'] + "&to=" + this.attributes['endstr'] +
            "&paginationSize=1000000&paginationOffset=0"
            // PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
            // "/private/payments/list.do?from=08.11.2010"+
            // "&to=08.11.2018"+
            // "&paginationSize=9999&paginationOffset=0"
          ).then((res) => {
            let obj = XMLMapping.load(res);
            if (undefined==obj.response.operations)
            this.emit(':tell', 'no data ');

            let arr1 = obj.response.operations.operation;

            let arr2 = history4_12(arr1);
            var str = '';
            arr2.forEach(function (item, i) {
              if (i < 49)
                str += i + 1 + ") " + item.to + " | " + item.description + " | " + item.date + " | " + item.amount + " " + item.currency + "<br/>";
            });
            console.log(arr2);
            var content = {
              "hasDisplaySpeechOutput": getSuccess(arr2.length != 0) + ", " + value + ", " + arr2.length + " items",
              "hasDisplayRepromptText": getSuccess(arr2.length != 0),
              "simpleCardTitle": value,
              "simpleCardContent": 'Payments: 0...50 of ' + arr2.length,//+", from "+this.attributes['startstr']+" to "+ this.attributes['endstr'],
              "bodyTemplateTitle": 'Payments: 0...50 of ' + arr2.length,//+", from "+this.attributes['startstr']+" to "+ this.attributes['endstr'],
              "bodyTemplateContent": str,
              "templateToken": "factBodyTemplate",
              "askOrTell": ":ask",
              "sessionAttributes": {
                "STATE": states.STARTMODE,
                "countitems": arr2.length,
                "startstr": this.attributes['startstr'],
                "endstr": this.attributes['endstr'],
                'currentpage': 0,
                'request': '412astext',
                //  'status':this.attributes['status']
                //'readstr':readstr                     //'bodyTemplateContent':str
              }
            };
            //self.emit(':saveState', true);

            renderTemplate.call(self, content);
          })

        }).catch((res) => {
          this.emit(':tell', 'some error, sorry ');
          console.log('catch1 from transaction history' + res);
        });

        break;
      default:
        this.emit(':ask', "repeat this request", "repeat this request");
        break;
    }



  },

  'Unhandled': function () {
    var message = 'Repeat the request.';
    this.emit(':ask', message, message);
    console.log("UNHANDLED2");

  }
});




// var guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
//   'NewSession': function() {
//
//     this.handler.state = '';
//     this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
//   },
//   'HelloWorldIntent': function() {
//     this.emit(':ask', 111, 222);
//   },
//   'Unhandled': function() {
//     //  this.handler.state = states.GUESSMODE;
//     this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
//   },
//   'NotANum': function() {
//     this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
//   }
// });





function supportsDisplay() {
  var hasDisplay =
    this.event.context &&
    this.event.context.System &&
    this.event.context.System.device &&
    this.event.context.System.device.supportedInterfaces &&
    this.event.context.System.device.supportedInterfaces.Display

  return hasDisplay;
}

function isSimulator() {
  var isSimulator = !this.event.context; //simulator doesn't send context
  return false;
}

function renderTemplate(content) {
  console.log("renderTemplate" + content.templateToken);


  switch (content.templateToken) {

    case "factBodyTemplate":

      var response = {
        "version": "1.0",
        "response": {
          "directives": [
            {
              "type": "Display.RenderTemplate",
              "template": {
                "type": "BodyTemplate1",
                "title": content.bodyTemplateTitle,
                "token": content.templateToken,
                "textContent": {
                  "primaryText": {
                    "type": "RichText",
                    "text": "<font size = '2'>" + content.bodyTemplateContent + "</font>"
                  }
                },
                "backButton": "HIDDEN"
              }
            }
          ],
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "SSML",
              "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
            }
          },
          "shouldEndSession": content.askOrTell == ":tell",
          "card": {
            "type": "Simple",
            "title": content.simpleCardTitle,
            "content": content.simpleCardContent
          }
        },
        "sessionAttributes": content.sessionAttributes
      }

      this.context.succeed(response);
      break;

    case "MultipleChoiceListView":
      console.log("listItems " + JSON.stringify(content.listItems));
      var response = {
        "version": "1.0",
        "response": {
          "directives": [
            {
              "type": "Display.RenderTemplate",
              "template": {
                "type": "ListTemplate1",
                "title": content.listTemplateTitle,
                "token": content.templateToken,
                "listItems": content.listItems,
                "backButton": "HIDDEN"
              }
            }
          ],
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "SSML",
              "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
            }
          },
          "shouldEndSession": content.askOrTell == ":tell",
          "card": {
            "type": "Simple",
            "title": content.simpleCardTitle,
            "content": content.simpleCardContent
          }
        },
        "sessionAttributes": content.sessionAttributes

      }
      this.context.succeed(response);

      break;
    default:
      this.emit(':tell', "Thanks for playing, goodbye");
  }

}

function isSimulator() {
  var isSimulator = !this.event.context; //simulator doesn't send context
  return isSimulator;
}

function renderTemplate2(content) {

  var response = {
    "version": "1.0",
    "response": {
      "directives": [{
        "type": "Display.RenderTemplate",
        "template": {
          "type": "BodyTemplate1",
          "title": content.bodyTemplateTitle,
          "token": content.templateToken,

          "textContent": {
            "primaryText": {
              "type": "RichText",
              "text": "<font size = '2'>" + content.bodyTemplateContent + "</font>"
            }
          },

          "backButton": "HIDDEN"
        }
      }],
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
      },
      "reprompt": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
        }
      },
      "shouldEndSession": content.askOrTell == ":tell",
      "card": {
        "type": "Simple",
        "title": content.simpleCardTitle,
        "content": content.simpleCardContent
      }
    },
    "sessionAttributes": content.sessionAttributes
  }
    ;

  // First param controls http vs. https
  console.log(content.imageUrl);

  let sources = [{
    "size": "SMALL",
    "url": content.imageUrl//"https://imgs.xkcd.com/comics/standards.png"
  },
  {
    "size": "LARGE",
    "url": content.imageUrl//"https://imgs.xkcd.com/comics/standards.png"
  }
  ];
  response["response"]["directives"][0]["template"]["backgroundImage"] = {};
  response["response"]["directives"][0]["template"]["backgroundImage"]["sources"] = sources;
  this.context.succeed(response);
}