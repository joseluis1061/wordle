const keyboard = document.querySelector("#keyboard");

const keyboardLeters =[
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l","ñ"],
  ["delete","z","x","c","v","b","n","m","enter"]
];


/*Initial vars*/
const listElements = [];
let myAnswer = [];
let secretWord = ["p","l","a","t","z","i"];
let positions = [];
const grid = document.querySelector("#grid");
const lives = 2; //Number of intents
let liNodes = []; //List of li 
let ulNodes = []; //List of ul
let intents = 0; //Lost lives
let numberLeter = 0; //Number of letter in screen's answer
/*Random word */
//const API = 'https://palabras-aleatorias-public-api.herokuapp.com/random';
const API = 'https://clientes.api.greenborn.com.ar/public-random-word';
const fetchApi = async()=>{
  const response = await fetch(API);
  const data = await response.json();
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
  let newWord = removeAccents(data[0]).toLowerCase();
  newWord = newWord.split('');
  secretWord = newWord;
  gridContructor()
  return newWord;
};
fetchApi();

/*Generate screen of answers */
const gridContructor = ()=>{
  console.log('secretWord***')
  console.log(secretWord)
  for(let i=0; i<lives; i++){
    const ulist = document.createElement('ul');
    ulist.className = `list_container`
    ulist.id = `list_container${i}`
    for(let j=0; j<secretWord.length;j++){      
      const listElement = document.createElement('li');
      listElement.className = `listElement listElement${i}${j}`;
      liNodes.push(listElement);            
    }
    ulist.append(...liNodes);
    ulNodes.push(ulist);
    liNodes = [];
  }
  grid.append(...ulNodes);
}

/*Reset screen's answers*/
const reiniciarTablero = () =>{
  liNodes = [];
  ulNodes = [];
  intents = 0;
  numberLeter=0;
  myAnswer=[];
  setTimeout(()=>{
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    const resultsH = document.querySelector("h2");
    resultsH.innerHTML = "";
    fetchApi();
  },1500)
};

//Generate board's buttons 
keyboardLeters.map(letters =>{
  const ulist = document.createElement('ul');
  letters.map(letter =>{
    const listItem = document.createElement('li');

    switch(letter){
      case("enter"):
        listItem.innerHTML=`
          <button class="btn btn_control" onclick="checkWord(event)" id=${letter}>
            ${letter}
          </button>`;
        break;

      case("delete"):
        listItem.innerHTML=`
          <button class="btn btn_control" onclick="deleteLetter(event)" id=${letter}>
            ${letter}
          </button>`;
        break;

      default:
      listItem.innerHTML=`
        <button class="btn btn_letter" onclick="pressLetter(event)" id=${letter}>
          ${letter}
        </button>`;
        break;
    }
    ulist.appendChild(listItem);
  })
  listElements.push(ulist);
});
keyboard.append(...listElements);

/*Detect letter press */
const pressLetter = (event)=>{
  const button = event.target;
  if(myAnswer.length < secretWord.length){
    myAnswer.push(button.id);
    const gridLeter = document.querySelector(`.listElement${intents}${numberLeter}`)
    gridLeter.innerHTML= button.id;
    numberLeter++;
  }else{
    console.log('Palabra llena')
  }
}

//Detect win or lose
const checkWord = ()=>{ 
  const resultsH = document.querySelector("h2");
  if(myAnswer.join("")===secretWord.join("")){
    resultsH.innerHTML = "¡Has Ganado!";
    matchAnswer();
    reiniciarTablero();
    return
  }
  if(intents === (lives-1)){
    if(myAnswer.join("")===secretWord.join("")){
      resultsH.innerHTML = "¡Has Ganado!";
      console.log("Has Ganado");
      reiniciarTablero();
      return
    }else{
      resultsH.innerHTML = "¡Has Perdido!";
      console.log("Perdio");
      matchAnswer();
      reiniciarTablero();
      return
    }
  }
  matchAnswer();
  
};
/*Detect and display match letters */
const matchAnswer = ()=>{
  //List of colors in match answer
  if(myAnswer.length === secretWord.length){
    for(let i = 0 ; i < secretWord.length; i++){
      switch (true) {
        case myAnswer[i] === secretWord[i]:
          positions.push("green");
          break;
        case secretWord.includes(myAnswer[i]):
          positions.push("marron");
          break;
        default:
          positions.push("gray");
          break;
      }
    }
    
    positions.map((item, letter)=>{
      console.log(`${item}`)
      const liItem = document.querySelector(`.listElement${intents}${letter}`);
      liItem.className = `listElement listElement${intents}${letter} ${item}`;
    });
    myAnswer = [];
    positions = [];
    intents++;
    numberLeter=0;
  }else{
    console.log("Your answer not's same to secret word");
  }
};
//Delete letter of answer
const deleteLetter = ()=>{
  if(myAnswer.length>0){
    myAnswer.pop();
    numberLeter--;
    const gridLeter = document.querySelector(`.listElement${intents}${numberLeter}`)
    gridLeter.innerHTML= "";
  }
  else{
    console.log('Tu palabra esta vacia');
  }
};

//New answerd
const newAnswerd = document.querySelector('.new_answerd');
newAnswerd.addEventListener('click', ()=>{
  reiniciarTablero();
})