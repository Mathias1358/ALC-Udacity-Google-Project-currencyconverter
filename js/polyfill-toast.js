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