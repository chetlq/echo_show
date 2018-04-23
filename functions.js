var color = function(){
    function rgb2hex(rgb){
     rgb = rgb.match(/^[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     var c = (rgb && rgb.length === 4) ?
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
     return c.toUpperCase();
    }
    var v = function(){ return Math.round(Math.random()*255)};
    return rgb2hex('('+v()+', '+v()+', '+v()+')');
  }

var isEmpty= (obj,val) =>obj[val]!==undefined;
var getCardTitle=() => "cardtitle";
var getSuccess=(val) =>val?"success":"unsuccess";

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

 var unique = function(arr) {
  var obj = {};
var count=0;
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].date;
    if (isEmpty(obj,arr[i].date)){count +=arr[i].amount;}else{count =arr[i].amount;}
    obj[str] = count; // запомнить строку в виде свойства объекта
  }

  return obj; // или собрать ключи перебором для IE8-
};

var unique2 = function(arr) {
  var obj = {};
var count=0;
  //for (var i = 0; i < arr.length; i++) {
  for(var key in arr){
    var str = key;
    var str2 = str.substring(str.indexOf(".")+1,str.length);
    if (isEmpty(obj,str2)){count +=arr[key];}else{count =arr[key];}
    obj[str2] = count; // запомнить строку в виде свойства объекта
  }

  return obj; // или собрать ключи перебором для IE8-
};

function compareNumeric(a, b) {
  var att = a.balance;
  var btt = b.balance;
  if (att > btt) return 1;
  if (att< btt) return -1;
};


module.exports.color = color;
module.exports.isEmpty = isEmpty;
module.exports.getCardTitle = getCardTitle;
module.exports.unique = unique;
module.exports.unique2 = unique2;
module.exports.getSuccess = getSuccess;
module.exports.compareNumeric = compareNumeric;
