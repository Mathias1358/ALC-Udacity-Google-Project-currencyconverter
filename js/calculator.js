
const calculateorOutput = document.querySelector('.calculateorOutput'); // calculator output display
const calculateorInput = document.querySelector('.calculateorInput');// calculator input display
const calculatButton = document.querySelector('.calculatButton');// calculator submit button
const clearCal = document.querySelector('.clearCal');// calculator clear button

const displayCalculatedOut = (calculated) => {
  return calculateorOutput.innerText = calculated;
}
const displayCalculatedInput = (calculated) => {
  return calculateorInput.innerText += calculated;
}
clearCal.addEventListener('click', ()=>{
  calculateorInput.innerText ='';
  calculateorOutput.innerText ='';
})
for (let ids of document.querySelectorAll('.digit.num')){
    ids.addEventListener('click', (e)=> {
      displayCalculatedInput(ids.innerText);
    });
}
calculatButton.addEventListener('click', ()=>{
  let score = 1;
    let figures = calculateorInput.innerText.split('X');
    for(let times of figures){
      if(times == '' || times == '0') return;
      score *= times;
    }
    displayCalculatedOut(score)
})


//const getDigit = document.querySelector('.inputDigit');// calculator input display