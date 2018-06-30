  /* little polylling here */
  
  String.prototype.toCurrencyString = (prefix, suffix) => {
    prefix = typeof prefix === 'undefined' ?  '' : prefix;
    suffix = typeof suffix === 'undefined' ?  '' : suffix;
    var _localeBug = new RegExp((1).toLocaleString().replace(/^1/, '').replace(/\./, '\\.') + "$");
    return prefix + (~~this).toLocaleString().replace(_localeBug, '') + (this % 1).toFixed(2).toLocaleString().replace(/^[+-]?0+/,'') + suffix;
  }

  const toast = (toast, varibles= null) =>{
    const toastContainer = document.querySelector('.toast');
    const toastNotification = document.querySelector('.toasted');
    const toastButton = document.querySelector('.toastButton');
    
    if(varibles != null) {
      toastButton.innerHTML = `<a href='./'> Update </a>`;
    }
  
    toastContainer.classList.add('show');
    toastNotification.innerHTML = toast;
    setTimeout(()=>{
      document.querySelector('.toast').classList.remove('show');
    }, 50000);
  }
  
  
document.querySelector('.toast .toastButton').addEventListener('click', ()=>{
  //document.querySelector('.toast').classList.remove('show');
})

/* javascript */

/* load all varibles */
/* 
  define varibles
*/
const APIDomain = 'https://free.currencyconverterapi.com/api/v5/';
const APIRoute = {'convert':'convert', 'currency': 'currencies', 'country':'countries'};
/*/
const APIDomain = '/api/';
const APIRoute = {'convert':'convert', 'currency': 'currencies.json', 'country':'countries.json'};
//*/
/* users form */
const convertButton = document.querySelector('#userSubmit');
const amount = document.querySelector('#amountInput');
const currencyTo = document.querySelector('#currencyTo');
const currencyFrom = document.querySelector('#currencyFrom');

/* div's and containers */
const notify = document.querySelector('.notification');
const exchangeRate = document.querySelector('.exchangeRate');

convertButton.addEventListener('click', () => {
  checkData();
});
amount.addEventListener('keypress', () => {
  checkData();
});
currencyFrom.addEventListener('change', () => {
  checkData();
});
currencyTo.addEventListener('change', () => {
  checkData();
});

/* get user actions (clicks, inputs and selects) */
const getAmount = () => {
  return amount.value=='' ? false : amount.value;
}
const getFromCurrency = () => {
  return currencyFrom.value=='' ? false : currencyFrom.value;
}
const getToCurrency = () => {
  return currencyTo.value=='' ? false : currencyTo.value;
}

/* display user actions (exchange rate, calculation) */

const displayExchangeRate = (display) => {
  const { rate, date } = display;
  return exchangeRate.innerHTML = `${getToCurrency()}${rate} <br> <small>as at, ${date} </small>`;
}

const setSelectOptions = (display, value) => {
  const getSelect = document.querySelectorAll('select');
  for (let option of getSelect){
    option.innerHTML += `<option value='${value}'> ${display}</option>`;
  }
}

/* start indexedDB */


/* 
  start writing code
*/

const getAPIUrl = (curFrom, curTo) => {
    return `${APIDomain}${APIRoute['convert']}?q=${curFrom}_${curTo}&compact=ultra`;
}

const getCurrency = () => {
  fetch (`${APIDomain}${APIRoute['currency']}`)
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse.results;
    for(let key in currency){
      setSelectOptions(`${currency[key].id} -- ${currency[key].currencyName}`, key)
    }
  })
  .catch ((e)=>{
    notify.innerText = e;
  })
}
const getExchangeRate = () => {
  exchangeRate.innerHTML = "<img src='./img/AGNB-loading.gif'/>";
    const exchange = `${getFromCurrency()}_${getToCurrency()}`;

    localIndexStorage.open().then((idbase) => {
      console.log(idbase)
      return localIndexStorage.getExchangeRate(exchange, idbase)
    })
    .then((localResponse) => {
      if (!localResponse)         return onlineConvertion(null);
      const { value, dates } = localResponse;
          return displayExchangeRate({rate : conversion(value, getAmount()), 'date' : dates});
      })
    .catch((error) => {
      console.log(error)
      return onlineConvertion(null);
    });
};

const conversion = (dbcurrency, amount) => {
  if (dbcurrency) {
    return (Math.round((dbcurrency * amount) * 100) / 100);
  }
}

const checkData = () => {
  let returnInputs = getAmount() !== false && getToCurrency() !== 'convert to' && getFromCurrency() !== 'convert From' ? getExchangeRate() : amount.focus();
}

const storeEventListener = (storage) => {
  document.querySelector('error.nothing').innerHTML += ` <store data='${storage.data}' class='${storage.id}'>`;
}

const getEventListener = (storage) => {
  return document.querySelector(`store.${storage}`).getAttribute('data');
}
const getMonth = (id) =>{
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return months[id];
}
const getDate = () => {
  let date = new Date();
  let time = date.toLocaleTimeString();
  date = `${date.getDate()}/${date.getDay()}/${date.getFullYear()}`;
  time =  time.split(':');
  const amPM = time[2].split(' ');
  hour = `${time[0]}:${time[1]} ${amPM[1]}`
    return `${date}, ${hour}`;
}
getCurrency();
startDb();

