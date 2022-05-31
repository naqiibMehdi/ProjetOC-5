import FetchApi from "./class/FetchApi.js";
import Products from "./class/Products.js";

const api = new FetchApi("http://localhost:3000/api/products")
const productCart = new Products()
const getBasketProducts = productCart.getLocalProduct("product")

//constante pour le panier
const cart_items = document.querySelector("#cart__items")
const nbArticles = document.querySelector("#totalQuantity")
const totalBill = document.querySelector("#totalPrice")


//constante pour le formulaire
const validateForm = document.querySelector(".cart__order")
const form = document.querySelector(".cart__order__form")
const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const address = document.querySelector("#address")
const city = document.querySelector("#city")
const email = document.querySelector("#email")

//constante pour les erreurs de formulaire
const errorFirstName = document.querySelector("#firstNameErrorMsg")
const errorLastName = document.querySelector("#lastNameErrorMsg")
const errorAddress = document.querySelector("#addressErrorMsg")
const errorCity = document.querySelector("#cityErrorMsg")
const errorEmail = document.querySelector("#emailErrorMsg")


//************************** controller pour les produits du panier ************************
if (getBasketProducts) {

  for (let pdtBasket of getBasketProducts) {

    api.getAllProducts().then(allProductsApi => {

      for(let pdtApi of allProductsApi){

        if(pdtBasket.id === pdtApi._id){

          cart_items.innerHTML += cartHTML(pdtBasket, pdtApi)
        }
      }
    })
  }
}

nbArticles.textContent = totalQuantityArticles(getBasketProducts)

//************************** controller pour les produits du panier ************************

//************************* controller pour le formulaire **********************************

firstName.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  console.log(value);
  if (!value) {
    errorFirstName.textContent = "Donnée incorrecte, vous devez saisir un prénom correcte";
  } else {
    errorFirstName.textContent = ""
  }
}))


lastName.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  console.log(value);
  if(!value){
    errorLastName.textContent = "Donnée incorrecte, vous devez saisir un nom correcte";
  }else{
    errorLastName.textContent = ""
  }
}))


address.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z0-9 ]+$/
  const value = e.target.value.match(re)
  console.log(value);
  if(!value){
    errorAddress.textContent = "Donnée incorrecte, vous devez saisir une adresse correcte";
  }else{
    errorAddress.textContent = ""
  }
}))

city.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  console.log(value);
  if (!value) {
    errorCity.textContent = "Donnée incorrecte, vous devez saisir une ville correcte";
    return
  } else {
    errorCity.textContent = ""
  }
}))


email.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z0-9_\-.]+@[a-z]{3,}\.[a-z]{2,5}$/
  const value = e.target.value.match(re)
  console.log(value);
  if (!value) {
    emailErrorMsg.textContent = "Donnée incorrecte, vous devez saisir un email correct";
  } else {
    emailErrorMsg.textContent = ""
  }
}))

//création de l'ID de la commande et redirection vers la page confirmation
validateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const contact = {}
  const dataPost = {}
  const formData = new FormData(form)
  const idListApi = listId(getBasketProducts)
  if(!getBasketProducts){
    alert("panier vide !")
    return
  }

    for(let [key, value] of formData.entries()){
      contact[key] = value
    }
  
    dataPost.contact = contact
    dataPost.products = idListApi
  
    const objFetch = {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(dataPost)
    }
  
    fetch("http://localhost:3000/api/products/order", objFetch).then(res => res.json())
    .then(data => {
        localStorage.clear()
        document.location.href = "./../html/confirmation.html?idCommand=" + data.orderId
    })
    .catch(e => console.log(e))
    
    
})

// ************************ controller formulaire ************************************



// liste des fonctions
function totalQuantityArticles(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.qtt).reduce((total, qtt) => total += qtt)
  } else {
    return 0
  }
}

function listId(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.id)
  } else {
    return []
  }
}

function totalPriceArticles(price) {
  totalPrice = 0
  if (price >= 1) {
    totalPrice += price
  } else {
    return 0
  }
  return totalPrice
}

function removeArticles(basket, dataset) {
  if (basket.length >= 1) {
    const deletItem = basket.filter(obj => obj.id !== dataset)
    LocalStorage.setItem("product", deletItem)
  } else {
    return []
  }
}

function cartHTML(basket, api) {


  return `<article class="cart__item" data-id="${basket.id}" data-color="${basket.color}">
    <div class="cart__item__img">
      <img src="${api.imageUrl}" alt="${api.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${api.name}</h2>
        <p>${basket.color}</p>
        <p>${api.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket.qtt}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

function itemArticle({id, color}){
  const article = document.createElement("article")
  article.setAttribute("data-id", id)
  article.setAttribute("data-color", color)
  article.classList.add("cart__item")
  article.appendChild(itemImg())
  article.appendChild(itemContent())
  return article
}

function itemImg(){
  const div = document.createElement("div")
  const img = document.createElement("img")
  div.classList.add("cart__item__img")
  div.appendChild(img)
  return div

}

function itemContent(){
  const div = document.createElement("div")
  div.classList.add("cart__item__content")
  div.appendChild(itemContentDescription())
  div.appendChild(itemContentSettings())
  return div
}

function itemContentDescription(){
  const div = document.createElement("div")
  const h2 = document.createElement("h2")
  const p = document.createElement("p")
  const p2 = document.createElement("p")

  div.classList.add("cart__item__content__description")
  p.textContent = ""

  div.appendChild(h2)
  div.appendChild(p)
  div.appendChild(p2)

 return div
}

function itemContentSettings(){
  const div = document.createElement("div")
  div.classList.add("cart__item__content__settings")
  div.appendChild(itemQuantity())
  div.appendChild(itemDelete())

  return div
}

function itemQuantity(){
  const div = document.createElement("div")
  const p = document.createElement("p")
  div.classList.add("cart__item__content__settings__quantity")

  p.textContent = "Qté : "

  div.appendChild(p)
  div.appendChild(createInput())

  return div
}

function itemDelete(){
  const div = document.createElement("div")
  const p = document.createElement("p")
  div.classList.add("cart__item__content__settings__delete")
  p.classList.add("deleteItem")
  p.textContent = "Supprimer"

  div.appendChild(p)

  return div

}

function createInput() {
  const input = document.createElement("input")
  input.type = "number"
  input.classList.add("itemQuantity")
  input.name = "itemQuantity"
  input.min = "1"
  input.max = "100"
  input.value = ""
  return input
}

//fonction spéciale pour le debouncing
function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}