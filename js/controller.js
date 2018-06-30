/* naming and settings for indexDB */
let dbname = {exchange: '', currency: ''}

// for browser compactibility
const dBase = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
localIndexStorage = window.LocalIndexedStorage;


/* service worker */
const startDb = () => {
  // Check for service worker and IndexedDB
  localIndexStorage = window.LocalIndexedStorage;
}

const registerServiceWorker = () => {
  if (!navigator.serviceWorker || !window.LocalIndexedStorage){ 
    toast('Service Worker not supported');
    return Promise.resolve();
  }
  navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
  .then((registration) => {
  console.log('welcome home again');
      // checking if controller is true/false
      if (!navigator.serviceWorker.controller) return;

      if(registration.waiting){
        toast('New Version Available', 'updateServiceWorker');
        registration.waiting.postMessage('skipWaiting');
        return;
      }
      if (registration.installing){
        serviceWorkerInstallation(registration.installing);
        return;
      }

      registration.addEventListener('updatefound', () => {
        serviceWorkerInstallation(registration.installing);
        return;
      });
  })
  .catch((err) => {
    console.log(`Error: SR2312, ${err}`)
  })
}
const serviceWorkerInstallation = (status) =>{
  status.addEventListener('statechange', () => {
    if (status.state == 'installed'){
      toast('you are now using latest version');
    }
  })
}

const onlineConvertion = () => {
  let fromCurrency = getFromCurrency();;
  let toCurrency = getToCurrency();
  notify.innerText = '';
    
  fetch (getAPIUrl(toCurrency, fromCurrency))
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse[`${toCurrency}_${fromCurrency}`];
    
      displayExchangeRate({rate :conversion(currency, getAmount()), date: getDate()})
      onlineReverseConvertion(getFromCurrency(), getToCurrency());
      
      storeIntoDatabase(`${toCurrency}_${fromCurrency}`, currency);
      return; 
  })
  .catch ((e)=>{
    let message = 'Oops, connection issues. Reconnecting...'
    notify.innerText = message;
    toast(message);
  })
}
const onlineReverseConvertion = (fromCurrency, toCurrency) => {

  fetch (getAPIUrl(fromCurrency, toCurrency))
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse[`${fromCurrency}_${toCurrency}`];
      storeIntoDatabase(`${fromCurrency}_${toCurrency}`, currency);
  })
  .catch ((e)=>{
    notify.innerText = e;
  })
}
const storeIntoDatabase = (conversions, amount) => {
  return localIndexStorage.open()
  .then((idb) => {
    localIndexStorage.setExchangeRate(conversions, amount, idb)
    toast('Do you know this exchange is now available offline?')
  })
  .catch((error) => {
    console.log('Database error: ', error.message)
  })
}