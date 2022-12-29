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
        modifQuantité(api, element)
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
function modifQuantité(api, element) {

  const art = document.querySelectorAll(".cart__item");

  art.forEach((te) => {

    te.addEventListener("change", function (e) {
      if (e.target.value < 1 || e.target.value > 100) { retrun }
      else {

        for (article of cart) {
          article.quantities = e.target.value
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
//-----------------------------------------------------------------------

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

  //-----------------------------------------------------------------------

  const validFirstName = function (inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (charRegExp.test(inputFirstName.value)) {
      firstNameErrorMsg.innerHTML = '';
    } else {
      firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
  };

  const validLastName = function (inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (charRegExp.test(inputLastName.value)) {
      lastNameErrorMsg.innerHTML = '';
    } else {
      lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
  };

  const validAddress = function (inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value)) {
      addressErrorMsg.innerHTML = '';
    } else {
      addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
  };

  const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (charRegExp.test(inputCity.value)) {
      cityErrorMsg.innerHTML = '';
    } else {
      cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
  };

  const validEmail = function (inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) {
      emailErrorMsg.innerHTML = '';
    } else {
      emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
    }
  };
}
getForm();












































