import "./styles/main.css";
const keyboard = document.querySelector("#keyboard");
const keyboardLeters =[
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l","ñ"],
  ["delete","z","x","c","v","b","n","m","enter"]
];


/*Initial vars*/
const listElements = [];
let myAnswer = [];
let secretWord = ["e","x","i","t","o"];
let positions = [];
const grid = document.querySelector("#grid");
const lives = 5; //Number of intents
let liNodes = []; //List of li 
let ulNodes = []; //List of ul
let intents = 0; //Lost lives
let numberLeter = 0; //Number of letter in screen's answer
/*Random word */
const API = 'https://random-word-api.herokuapp.com/word?lang=es&length=6';
const fetchApi = async()=>{
  const response = await fetch(API);
  const data = await response.json();
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
  let newWord = removeAccents(data[0]).toLowerCase();
  newWord = newWord.split('');
  console.log(newWord);
  secretWord = newWord;
  gridContructor()
  return newWord;
};
fetchApi();

/*Generate screen of answers */
const gridContructor = ()=>{
  //console.log('secretWord: '+secretWord)
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
  },2500);
};

//Generate board's buttons 
keyboardLeters.map(letters =>{
  const ulist = document.createElement('ul');
  letters.map(letter =>{
    const listItem = document.createElement('li');
    let boton = document.createElement('button');

    switch(letter){
      case("enter"):
        boton.addEventListener('click', (e)=>checkWord(e))
        boton.id = `${letter}`;
        // boton.innerHTML = `${letter}`;
        boton.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i>`;
        boton.className = 'btn btn_control';
        listItem.appendChild(boton);
        break;

      case("delete"):
        boton.addEventListener('click', (e)=>deleteLetter(e))
        boton.id = `${letter}`;
        boton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        boton.className = 'btn btn_control';
        listItem.appendChild(boton)
        break;

      default:
        boton.addEventListener('click', (e)=>pressLetter(e))
        boton.id = `${letter}`;
        boton.innerHTML = `${letter}`;
        boton.className = 'btn btn_letter';
        listItem.appendChild(boton)
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
    const resultsH = document.querySelector("h2");
    resultsH.innerHTML = "¡Palabra llena!";
    setTimeout(()=>{
      resultsH.innerHTML = "";
    },1500);
  }
};

//Detect win or lose
const checkWord = ()=>{ 
  console.log(secretWord)
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
      reiniciarTablero();
      return
    }else{
      resultsH.innerHTML = `¡Has Perdido! = > ${secretWord.join("")}`;
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
      const liItem = document.querySelector(`.listElement${intents}${letter}`);
      liItem.className = `listElement listElement${intents}${letter} ${item}`;
    });
    myAnswer = [];
    positions = [];
    intents++;
    numberLeter=0;
  }else{
    const resultsH = document.querySelector("h2");
    resultsH.innerHTML = "Tu palabra esta vacia";
    setTimeout(()=>{
      resultsH.innerHTML = "";
    },2500);
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
    const resultsH = document.querySelector("h2");
    resultsH.innerHTML = "Tu palabra esta vacia";
    setTimeout(()=>{
      resultsH.innerHTML = "";
    },1500);
  }
};

//New answerd
const newAnswerd = document.querySelector('.new_answerd');
newAnswerd.addEventListener('click', ()=>{
  reiniciarTablero();
})
//Modal
const modalClose = document.querySelector('.modal-close');
const modalIntructions = document.querySelector('.modal-intruccions');

modalClose.addEventListener('click', ()=>{
  modalIntructions.className += ' display_none';  
});

const modalOpen = document.querySelector('.modal-open');
modalOpen.addEventListener('click', ()=>{
  modalIntructions.classList.remove('display_none');  
});

//Settings
const settingBtn = document.querySelector('.setting-btn');
const btnCerrar = document.querySelector('.btn-cerrar');
const settings = document.querySelector('.settings');
settingBtn.addEventListener('click', ()=>{
  settings.classList.remove('display_none');
});

btnCerrar.addEventListener('click', ()=>{
  settings.className += ' display_none'; 
});