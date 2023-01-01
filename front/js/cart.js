//--------------juxtapose  data from API and LocalStorage--------------
/**
 * create an empty array which is going to contain all objects
 * create a loop over the local storage in order to push all parsed data in the array 
 * loop over the array and the fetch of the missed value of stored products by calling the needed ones which already exsiste in the localstorage 
 */
//----------------------------------------------------------------------

let cart = []

for (let i = 0; i < localStorage.length; i++) {
  let productParse = JSON.parse(window.localStorage.getItem(localStorage.key(i)))
  cart.push(productParse);

}
//*************************************************************************************

cart.map(
  element => {

    fetch('http://localhost:3000/api/products/' + element.id)

      .then(function (response) {
        return response.json()
      })

      .then(api => {

        cartTemplate(api, element)
        articlesSum(api, element)
        modifQuantity(api, element)
        deleteItems(api, element)

      })

      .catch(error => {
        alert(" Erreur : " + error.message);
      })
      ;
  })
//*************************************************************************************

//--------------funtion enables to display items in cart--------------
/**
* using backticks, the values gathered  from API and localStorage are filled in HTML section
*/
//---------------------------------------------------------------------

function cartTemplate(api, element) {

  cart__items.innerHTML += ` <article class="cart__item" data-id = "${element.id}" data-color= "${element.colours}" data-quantité ="${element.quantities}" data-prix="${api.price}" >
                <div class="cart__item__img">
                  <img src="${api.imageUrl}" alt="${api.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${api.name}</h2>
                    <p>${element.colours}</p>
                    <p data-prix="${api.price}"> ${api.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${element.quantities} >
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" >Supprimer</p>

                    </div>
                  </div>
                </div>
              </article> `

}

//*************************************************************************************

//------funtion enables to calculate the sum of quantities and prices in cart page ------
/**
 * get the element we want to apply arithmrtic operations on 
 *  loop over it then display the sum of quantities
 * display the sum of prices 
 */
//-----------------------------------------------------------------------------
document.getElementById('totalQuantity').textContent = 0
document.getElementById('totalPrice').textContent = totalPrix = 0

function articlesSum() {
  let totalPrix = 0;
  let totalQtn = 0;

  const art = document.querySelectorAll(".cart__item");

  art.forEach((art) => {

    totalQtn += JSON.parse(art.dataset.quantité);
    totalPrix += JSON.parse(art.dataset.quantité) * art.dataset.prix;

  })
  document.getElementById('totalQuantity').textContent = totalQtn;
  document.getElementById('totalPrice').textContent = totalPrix;
}


//*************************************************************************************

//--------------funtion enables to delete items from cart---------------
/**
 * get the wanted element "supprimer"
 * change th HTMLCollection to Array then loop over it
 * add event Listener click to remove both local storage key and DOM html of the clicked item
 */
//-----------------------------------------------------------------------

function deleteItems(api, element) {
  let supprime = document.getElementsByClassName('deleteItem');

  Array.from(supprime).forEach(function (deleteButton) {

    deleteButton.addEventListener("click", function () {

      deleteButton.closest('article').remove()
      window.localStorage.removeItem(element.id + element.colours)

      articlesSum(api, element);

    })

  })
}
//*************************************************************************************

//-----------funtion enables to change quantity of items  cart-----------

/**
* get the element we want to modify 
* loop over it and listen to its children's changes
* lop again over the array that holds localstorage keys
* assign the modified value to the stored one
* stringify new quantities data
* update dataset quaitity new value
*/
//-----------------------------------------------------------------------
function modifQuantity(api, element) {

  const art = document.querySelectorAll(".cart__item");

  art.forEach((te) => {

    te.addEventListener("change", function (e) {
      if (e.target.value < 1 || e.target.value > 100) { retrun }
      else {

        for (article of cart) {
          article.quantities = Number(e.target.value)
          let product = article.id + article.colours
          window.localStorage.setItem(product, JSON.stringify(article))
          te.dataset.quantité = e.target.value;
          articlesSum(api, element);

        }
      }
    })

  })
}
//*************************************************************************************

//-----------function enables to insert regular expressions for form fields-----------
/**
* get the form class and create variables whixh stock needed RegEpx
* listen to each filed changes and mutch the appropriate RegExp
* validate or deny the entries with a warning p
*/
//---------------------------------listening-----------------------------------------

function getForm() {

  let form = document.querySelector(".cart__order__form");

  let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+",);

  form.firstName.addEventListener('change', function () {
    validFirstName(this);
  });

  form.lastName.addEventListener('change', function () {
    validLastName(this);
  });

  form.address.addEventListener('change', function () {
    validAddress(this);
  });

  form.city.addEventListener('change', function () {
    validCity(this);
  });

  form.email.addEventListener('change', function () {
    validEmail(this);
  });

  //----------------------------Validating functions----------------------------------

  const validFirstName = function (inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (charRegExp.test(inputFirstName.value) == true) {
      form.firstName.style.border = "none"
      firstNameErrorMsg.innerHTML = '';
    }
    else {

      firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      form.firstName.style.border = "solid 1.5px red"
    }

  };

  const validLastName = function (inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (charRegExp.test(inputLastName.value) == true) {
      form.lastName.style.border = "none"
      lastNameErrorMsg.innerHTML = '';
    }

    else {
      lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      form.lastName.style.border = "solid 1.5px red"
    }


  }


  const validAddress = function (inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value) == true) {
      addressErrorMsg.innerHTML = '';
      form.address.style.border = "none"
    }

    else {
      addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      form.address.style.border = "solid 1.5px red";
    }
  };

  const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (charRegExp.test(inputCity.value) == true) {
      cityErrorMsg.innerHTML = '';
      form.city.style.border = "none"
    }

    else {

      cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      form.city.style.border = "solid 1.5px red"
    }
  };

  const validEmail = function (inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value) == true) {
      form.email.style.border = "none"
      emailErrorMsg.innerHTML = '';
    }
    else {
      emailErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      form.email.style.border = "solid 1.5px red"
    }
  };
}
getForm();

//*************************************************************************************

//-----------function enables to post client's info to API-----------
/**
* get button and listent to click , stok form element in variables
* create an Array contains an object thats  has assigned data entred by the user gfor each specified element in the DOM
* and a key contans an array with values of loacalStorage id of each product
* use fetch post methode to send data to API URL 
* clear LoaclStorage
* stock the promise in LocalStorage
* change the current URL for confirmation HTML page
*/
//------------------------------------------------------------------------------------



function postForm() {
  const orderButton = document.getElementById("order");
  let form = document.querySelector(".cart__order__form");


  orderButton.addEventListener("click", (e) => {

    let inputName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');

    if (localStorage.length == 0) {
      e.preventDefault();
      alert('Veuillez choisir un article avant de passez votre commande.')
    }
    else if (
      inputAdress.value === '' ||
      inputCity.value === '' ||
      inputLastName.value === '' ||
      inputMail.value === '' ||
      inputName.value === ''
    ) {
      e.preventDefault();
      alert('Veuillez renseigner tout les champs.')
    }

    else {

      let productId = []

      for (let i = 0; i < localStorage.length; i++) {
        let productParse = JSON.parse(window.localStorage.getItem(localStorage.key(i))).id
        productId.push(productParse)

      }

      const order = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          address: inputAdress.value,
          city: inputCity.value,
          email: inputMail.value,
        },
        products: productId,
      }


      fetch("http://localhost:3000/api/products/order", {

        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        },
      })

        .then((response) => response.json())
        .then((data) => {

          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);
          document.location.href = "confirmation.html";
        })
        .catch(error => {
          alert(" Erreur : " + error.message);
        })
        ;

    }
  })

}
postForm();













































