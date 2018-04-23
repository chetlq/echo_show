'use strict';

var history4_12 = function(arr){
    return arr.map(function(item) { 

        let to = (item.to==undefined)?"not target":item.to.$t.replace(/[^\d\sA-Za-zА-Яа-я-/.]/gi,"").replace(/\s+/ig, ' ').replace(/\d\d\d\d\d/g,"").replace(/\d\d\d/g,"") ;

        let description=(item.description==undefined)?'not description': item.description.$t.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"") || "not description";
        if (item.operationAmount==undefined) return undefined;


        let amount =parseInt( item.operationAmount.amount.$t);
        if (amount==0 ||  isNaN(amount)) return undefined;
        let currency = item.operationAmount.currency.code.$t;
  

        let date = item.date.$t;
        // amount = Math.round(parseInt(amount))+"";
        // let currency = item.operationAmount.currency.code.$t.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"") || "not code";
  
        date =date.split("T")[0]+"";
        date = date.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"");
        if (amount!==0)
        return {
          to:to,
          description:description,
          date:date,
         amount:amount,
        currency:currency
        }

       } ).filter(function(item) {
         if(item!==undefined)
        return item;
      });
}

var financial_calendar_4_11_7 = function(arr){
  return arr.map(function(item) { 

      let outcome = (item.outcome.$t==undefined)?0:parseInt( item.outcome.$t); 
      if (isNaN(outcome) || outcome==undefined) return undefined;
      
      let income = (item.income.$t==undefined)?0:parseInt( item.income.$t); ;
      if (isNaN(income) || income==undefined) return undefined;
            
  

      let date = item.date.$t;

      if ((income===0 && outcome===0) || (date===undefined)) return undefined;
    
      return {
        outcome:outcome,
        income:income,
        date:date
      }
  

     } ).filter(function(item) {
       if(item!==undefined)
      return item;
    });
}

var financial_calendar_ofday_4_11_8 = function(obj){
  let arr = obj.response.data.operations.operation;
  return arr.map(function(item) { 
            let description=(item.description==undefined)?'not description': item.description.$t.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"").replace(/\s\s\s+/g,"") || "not description";
            let categoryName=(item.categoryName==undefined)?'not description': item.categoryName.$t.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"") || "not categoryName";
            
            if (item.amount==undefined) return undefined;
    
    
            let amount =parseInt( item.amount.$t);
            if (amount==0 ||  isNaN(amount)) return undefined;

            // amount = Math.round(parseInt(amount))+"";
            // let currency = item.operationAmount.currency.code.$t.replace(/[^\d\sA-Za-zА-Яа-я/.]/gi,"") || "not code";
      

            if (amount!==0)
            return {
              description:description,
              categoryName:categoryName,
             amount:amount
            }
    
           } ).filter(function(item) {
             if(item!==undefined)
            return item;
          });
}
var func1 = function(val){
  let res= (val==undefined)?0:val.$t.replace(/[^\d\sA-Za-zА-Яа-я-/.]/gi,"").replace(/\s*/g, '') ;
  if (res==0 || isNaN(parseInt(res))) return NaN;
  return parseInt(res);
}
var func2 = function(val){
  let res= (val=='')?undefined:val.$t.replace(/[^\d\sA-Za-zА-Яа-я-/.]/gi,"").replace(/\s*/g, '') ;
  return  (res=='')?undefined:res;
}
var diag4_11_6 = function (obj) {
  var cards = obj.response.cards.card;
  // var accounts = obj.response.accounts.account;
  // var imaccounts = obj.response.imaccounts.imaccount;

  cards = cards.map(function (item) {

    let balance = func1(item.balance);
    let id = func2(item.id);
    if (!isNaN(balance) && id !== undefined)
      return {
        id: id,
        balance: balance
      }

  }).filter(function(item) {
    if(item!==undefined)
   return item;
 });
//   accounts = accounts.map(function (item) {

//     let balance = func1(item.balance);
//     let id = func2(item.id);
//     if (!isNaN(balance) && id !== undefined)
//       return {
//         id: id,
//         balance: balance
//       }

//   }).filter(function(item) {
//     if(item!==undefined)
//    return item;
//  });
//   imaccounts = imaccounts.map(function (item) {

//     let balance = func1(item.balance);
//     let id = func2(item.id);
//     if (!isNaN(balance) && id !== undefined)
//       return {
//         id: id,
//         balance: balance
//       }

//   }).filter(function(item) {
//     if(item!==undefined)
//    return item;
//  });
  return {
    cards:cards//,
    // accounts:accounts,
    // imaccounts:imaccounts
  }
}

module.exports.diag4_11_6 = diag4_11_6;
module.exports.history4_12 = history4_12;
module.exports.financial_calendar_4_11_7  =financial_calendar_4_11_7;
module.exports.financial_calendar_ofday_4_11_8  =financial_calendar_ofday_4_11_8;