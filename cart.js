import { addToCart } from "./utilities.js";
import { getProductById } from "./utilities.js";
function displayCartItems() {
    console.warn('here');
    const CART_ITEMS_CONTAINER = document.getElementById('cart-items');
    const CART = getCartFromLocalStorage();
    const CART_STATUS = document.getElementById('empty-cart');
    console.log(CART);
    if (CART && CART.length > 0) {
        CART.forEach((cartItem) => {
            if (cartItem.quantity < 1) {
                CART_STATUS.style.padding = "20px";
                const UPDATED_CART = CART.filter(item => item.id !== cartItem.id);
                saveCartToLocalStorage(UPDATED_CART);
                return;
            }
            const CART_ITEM_ELEMENT = createCartItemElement(cartItem);
            CART_ITEMS_CONTAINER.appendChild(CART_ITEM_ELEMENT);
        });
    }
    else {
        CART_STATUS.innerHTML = "The cart is empty";
        CART_STATUS.style.padding = "2rem";
        CART_STATUS.style.textAlign = "center";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    calculateTotalPrice();
    grandPrice();
    seasonalOffer();
});
const PRODUCT_CARDS = document.getElementById("productCards");
if (PRODUCT_CARDS) {
    PRODUCT_CARDS.addEventListener("click", (event) => {
        let TARGET = event.target;
        if (TARGET.classList.contains("add-to-cart")) {
            const PRODUCT_ID = TARGET.getAttribute("data-product-id");
            if (PRODUCT_ID) {
                const PRODUCTS = JSON.parse(localStorage.getItem("products"));
                const PRODUCT = getProductById(PRODUCT_ID);
                if (PRODUCT) {
                    addToCart(PRODUCT);
                }
            }
        }
    });
}
;
function createCartItemElement(cartItem) {
    const CART_ITEM_ELEMENT = document.createElement('div');
    CART_ITEM_ELEMENT.classList.add('cart-item');
    console.log("cartItem", cartItem);
    CART_ITEM_ELEMENT.innerHTML = `
        <div class="cart-list d-flex align-items-center justify-content-between">
            <div class="cart-item-image d-flex align-items-center">
                <img id="cart-img" class="card-img-top" src="${cartItem.image}" alt="${cartItem.title}">
                <div class="cart-info d-flex flex-column">
                    <p class="card-title" id="cart-title">${cartItem.title}</p>
                    <div class="item-info d-flex">
                        <p class="category-name">${cartItem.category}</p>
                        <p class="product-id">ID: ${cartItem.id}</p>
                    </div>
                </div>
            </div>
            
            <div class="cart-item-details d-flex" style="color: white;">
                <div class="denomination d-flex justify-content-end">
                    <p id="price-${cartItem.id}" class="cart-list-price">$${(cartItem.currentPrice).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick=decreaseQuantity(cartItem.id) id="decrease" class="btn btn-primary decrease-quantity" data-product-id="${cartItem.id}">-</button>
                        <span class="quantity-amount" id="quantity-${cartItem.id}">${cartItem.quantity}</span>
                        <button onclick=increaseQuantity(cartItem.id) id="increase" class="btn btn-primary increase-quantity" data-product-id="${cartItem.id}">+</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return CART_ITEM_ELEMENT;
}
function calculateTotalPrice() {
    const CART = getCartFromLocalStorage();
    const TOTAL_PRICE_CONTAINER = document.getElementById('total-price');
    if (CART && CART.length > 0) {
        const TOTAL_PRICE = CART.reduce((total, cartItem) => {
            return total + (cartItem.price * cartItem.quantity);
        }, 0);
        TOTAL_PRICE_CONTAINER.innerHTML = `$${TOTAL_PRICE.toFixed(2)}`;
    }
    else {
        TOTAL_PRICE_CONTAINER.innerHTML = '';
    }
}
function seasonalOffer() {
    const OFFER_VALUE = document.getElementById('offer');
    const TOTAL_PRICE = document.getElementById('total-price');
    console.log(OFFER_VALUE.innerHTML);
    if (TOTAL_PRICE) {
        OFFER_VALUE.innerHTML = ((parseInt(TOTAL_PRICE.innerText.replace('$', '')) * 0.20).toFixed(2)).toString();
    }
    else {
        OFFER_VALUE.innerHTML = 'N/A'; // set default value for OFFER_VALUE
    }
}
function grandPrice() {
    const DELIVERY_PRICE_FETCH = document.getElementById('delivery');
    const OFFER_PRICE_FETCH = document.getElementById('offer');
    let TOTAL_PRICE = document.getElementById('total-price');
    let grandPrice = document.getElementById('grand');
    let deliveryPrice = 0;
    let offerPrice = 0;
    if (DELIVERY_PRICE_FETCH) {
        deliveryPrice += parseFloat(DELIVERY_PRICE_FETCH.innerText);
    }
    if (OFFER_PRICE_FETCH) {
        offerPrice += parseFloat(OFFER_PRICE_FETCH.innerText);
    }
    console.log(deliveryPrice, offerPrice, grandPrice);
    if (grandPrice && TOTAL_PRICE)
        grandPrice.innerHTML = ((parseFloat(TOTAL_PRICE.innerText.replace('$', '')) - offerPrice + deliveryPrice).toFixed(2)).toString();
    console.log(grandPrice.innerHTML);
}
function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCartToLocalStorage(CART) {
    localStorage.setItem('CART', JSON.stringify(CART));
}
document.getElementById('cart-items').addEventListener('click', (event) => {
    const TARGET = event.target;
    if (TARGET.classList.contains('decrease-quantity')) {
        const PRODUCT_ID = TARGET.getAttribute('data-product-id');
        if (PRODUCT_ID) {
            decreaseQuantity(parseFloat(PRODUCT_ID));
        }
    }
    else if (TARGET.classList.contains('increase-quantity')) {
        const PRODUCT_ID = TARGET.getAttribute('data-product-id');
        if (PRODUCT_ID) {
            increaseQuantity(parseFloat(PRODUCT_ID));
        }
    }
});
// Handles the increase in quantity of specific items
function increaseQuantity(PRODUCT_ID) {
    const CART = getCartFromLocalStorage();
    console.log(CART);
    let UPDATED_CART = CART.map((cartItem) => {
        if (cartItem.id === PRODUCT_ID) {
            console.error(cartItem.quantity);
            cartItem.quantity++;
            console.error(cartItem.quantity);
            cartItem.currentPrice = cartItem.price * cartItem.quantity;
            console.log(cartItem, cartItem.currentPrice, cartItem.quantity);
            document.getElementById("price-" + (cartItem.id).toString()).innerText = '$' + cartItem.currentPrice.toFixed(2);
            document.getElementById("quantity-" + (cartItem.id).toString()).innerText = cartItem.quantity;
        }
        return cartItem;
    });
    saveCartToLocalStorage(UPDATED_CART);
    calculateTotalPrice();
    grandPrice();
}
// Handles the increase in quantity of specific items and removes from cart when quantity is 0
function decreaseQuantity(PRODUCT_ID) {
    let isNull = false;
    const CART = getCartFromLocalStorage();
    let UPDATED_CART = CART.map((cartItem) => {
        if (cartItem.id === PRODUCT_ID) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cartItem.currentPrice -= cartItem.price;
                document.getElementById("price-" + cartItem.id).innerText = '$' + cartItem.currentPrice.toFixed(2);
                document.getElementById("quantity-" + cartItem.id).innerText = cartItem.quantity;
            }
            else {
                isNull = true;
                return null;
            }
        }
        return cartItem;
    });
    UPDATED_CART = UPDATED_CART.filter((item) => item !== null);
    saveCartToLocalStorage(UPDATED_CART);
    calculateTotalPrice();
    grandPrice();
    if (isNull) {
        window.location.reload();
    }
}
function razorPay() {
    let options = {
        "key": "rzp_test_sXsEb6LoQEVd5E",
        "amount": (parseFloat(document.getElementById('grand').innerHTML) * 100).toFixed(2),
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "",
        "handler": function (response) {
            window.location.href = "success.html";
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    let rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    document.getElementById('rzp-button1').onclick = function (e) {
        rzp1.open();
        e.preventDefault();
    };
}
