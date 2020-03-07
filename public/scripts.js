let ingr = document.querySelector("#ingr")

ingr.addEventListener('click', function(event){
    let next = event.target.nextElementSibling
    if(ingr.innerHTML === "MOSTRAR"){
        next.classList.remove('inactive')
        ingr.innerHTML = "ESCONDER"
    }else if(ingr.innerHTML === "ESCONDER"){
        next.classList.add('inactive')
        ingr.innerHTML="MOSTRAR"
    }
})

let prep = document.querySelector("#prep")
prep.addEventListener('click', function(event){
    let next = event.target.nextElementSibling
    if(prep.innerHTML === "MOSTRAR"){
    next.classList.remove('inactive')
    prep.innerHTML = "ESCONDER"
}else if(prep.innerHTML === "ESCONDER"){
    next.classList.add('inactive')
    prep.innerHTML="MOSTRAR"
}
})

let info = document.querySelector("#info")
info.addEventListener('click', function(event){
    let next = event.target.nextElementSibling
    if(info.innerHTML === "MOSTRAR"){
        next.classList.remove('inactive')
        info.innerHTML = "ESCONDER"
    }else if(info.innerHTML === "ESCONDER"){
        next.classList.add('inactive')
        info.innerHTML="MOSTRAR"
    }
})


function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  document.querySelector(".add-ingredient")
  document.addEventListener("click", addIngredient)


const prepField = document.querySelector(".add-preparation")

function addPreparation() {
    const preparations = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(
        true
    );
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparations.appendChild(newField);
};

prepField.addEventListener("click",addPreparation);


