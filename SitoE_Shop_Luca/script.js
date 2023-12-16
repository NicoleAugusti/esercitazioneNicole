// All'inizio del documento, leggi l'array dei prodotti dal local storage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartCounter = cartItems.reduce((total, item) => total + item.quantity, 0);
updateCartCounter(cartCounter);

// Funzione per aggiornare il numero nel carrello
function updateCartCounter(counter) {
    const cartCounterElement = document.getElementById('cart-counter');
    const cartCounterNavbarElement = document.getElementById('cart-counter-navbar');

    if (cartCounterElement) {
        cartCounterElement.textContent = counter;
    }

    if (cartCounterNavbarElement) {
        cartCounterNavbarElement.textContent = counter;
    }
}

// Funzione per visualizzare i prodotti nel carrello
function displayCartItems() {
    // Aggiungi qui la logica per visualizzare i prodotti nel carrello
    const cartContainer = document.getElementById('cart-container');

    // Svuota il contenuto attuale del carrello
    if (cartContainer) {
        cartContainer.innerHTML = '';

        // Itera attraverso gli oggetti del carrello e visualizzali
        cartItems.forEach(function (product, index) {
            const productCard = document.createElement('div');
            productCard.className = 'card';
            productCard.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${product.name} (${product.quantity}x)</h5>
  
                    </div>
                    <img src="${product.image}" alt="${product.name}" class="card-img-top">
                    <p class="card-text">${product.description}</p>
                    <div class="quantity-container">
                    <button class="btn btn-secondary btn-sm decrease-quantity" data-product-index="${index}">-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="btn btn-secondary btn-sm increase-quantity" data-product-index="${index}">+</button>
                    <button class="btn btn-danger btn-sm delete-button" data-product-index="${index}">&times;</button>
                </div>
                    
                </div>
            `;
            cartContainer.appendChild(productCard);
        });

        // Aggiungi un gestore di eventi per eliminare un prodotto
        const deleteButtons = document.querySelectorAll('.delete-button');
        const decreaseQuantityButtons = document.querySelectorAll('.decrease-quantity');
        const increaseQuantityButtons = document.querySelectorAll('.increase-quantity');

        deleteButtons.forEach(function (deleteButton) {
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                const indexToRemove = parseInt(deleteButton.getAttribute('data-product-index'));
                if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < cartItems.length) {
                    cartItems.splice(indexToRemove, 1);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    displayCartItems(); // Aggiornare la visualizzazione dopo la rimozione di un prodotto
                    cartCounter = cartItems.reduce((total, item) => total + item.quantity, 0);
                    updateCartCounter(cartCounter); // Aggiornare il contatore dopo la rimozione di un prodotto
                }
            });
        });

        // Aggiungi un gestore di eventi per diminuire la quantità
        decreaseQuantityButtons.forEach(function (decreaseButton) {
            decreaseButton.addEventListener('click', function (event) {
                event.preventDefault();
                const indexToDecrease = parseInt(decreaseButton.getAttribute('data-product-index'));
                if (!isNaN(indexToDecrease) && indexToDecrease >= 0 && indexToDecrease < cartItems.length) {
                    if (cartItems[indexToDecrease].quantity > 1) {
                        cartItems[indexToDecrease].quantity -= 1;
                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                        displayCartItems(); // Aggiornare la visualizzazione dopo la diminuzione della quantità
                        cartCounter = cartItems.reduce((total, item) => total + item.quantity, 0);
                        updateCartCounter(cartCounter); // Aggiornare il contatore dopo la diminuzione della quantità
                    }
                }
            });
        });

        // Aggiungi un gestore di eventi per aumentare la quantità
        increaseQuantityButtons.forEach(function (increaseButton) {
            increaseButton.addEventListener('click', function (event) {
                event.preventDefault();
                const indexToIncrease = parseInt(increaseButton.getAttribute('data-product-index'));
                if (!isNaN(indexToIncrease) && indexToIncrease >= 0 && indexToIncrease < cartItems.length) {
                    cartItems[indexToIncrease].quantity += 1;
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    displayCartItems(); // Aggiornare la visualizzazione dopo l'aumento della quantità
                    cartCounter = cartItems.reduce((total, item) => total + item.quantity, 0);
                    updateCartCounter(cartCounter); // Aggiornare il contatore dopo l'aumento della quantità
                }
            });
        });
    }
}


// Funzione per aggiungere il prodotto al carrello
function addToCart(button) {
    // Ottieni i dettagli del prodotto dal pulsante cliccato (es. nome, descrizione, immagine)
    const product = {
        name: button.dataset.productName,
        description: button.dataset.productDescription,
        image: button.dataset.productImage
        // Aggiungi altri dettagli del prodotto se necessario
    };

    // Cerca il prodotto nel carrello
    const existingProductIndex = cartItems.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        // Se il prodotto è già presente, aumenta la quantità
        cartItems[existingProductIndex].quantity += 1;
    } else {
        // Altrimenti, aggiungi il prodotto al carrello
        product.quantity = 1;
        cartItems.push(product);
    }

    console.log('Prodotto aggiunto al carrello:', product);

    cartCounter = cartItems.reduce((total, item) => total + item.quantity, 0);
    updateCartCounter(cartCounter);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems(); // Aggiornare la visualizzazione quando si aggiunge un prodotto
}

// Chiamata alla funzione displayCartItems quando la pagina si carica
document.addEventListener('DOMContentLoaded', function () {
    displayCartItems();
});

// Chiamata alla funzione displayCartItems quando il documento viene completamente caricato e la pagina è visibile
window.addEventListener('load', function () {
    displayCartItems();
});

// Seleziona tutti i pulsanti "Aggiungi al Carrello"
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Aggiungi un gestore di eventi a ciascun pulsante
addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // Impedisci il comportamento predefinito
        addToCart(button);
    });
});

// Aggiungi un gestore di eventi al pulsante "Vai al Carrello"
const goToCartButton = document.getElementById('go-to-cart');
if (goToCartButton) {
    goToCartButton.addEventListener('click', function (event) {
        event.preventDefault(); // Impedisci il comportamento predefinito
        displayCartItems();
        // Aggiungi qui la logica per visualizzare la pagina del carrello
    });
}

// Funzione per andare alla home o al carrello
function navigate(destination) {
    if (destination === 'home') {
        window.location.href = 'index.html';
    } else if (destination === 'cart') {
        displayCartItems();
        // Aggiungi qui la logica per visualizzare la pagina del carrello
    }
}

// Funzione per andare alla home
function goToHome() {
    window.location.href = 'index.html';
}

// Aggiungi un gestore di eventi al pulsante "Torna alla Home"
const goToHomeButton = document.getElementById('go-to-home');
if (goToHomeButton) {
    goToHomeButton.addEventListener('click', function (event) {
        event.preventDefault(); // Impedisci il comportamento predefinito
        goToHome(); // Chiamata alla funzione goToHome
    });
}

// Aggiungi altre azioni JavaScript secondo necessità
