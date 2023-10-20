import { CartProduct } from "./Products";
import { addToCart } from "./utilities.js";
import { getProductById } from "./utilities.js";


function increaseQuantity(productId : number) {
    const cart = getCartFromLocalStorage();
    let updatedCart = cart.map((cartItem) => {
        if (cartItem.id === productId) {
            
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

    saveCartToLocalStorage(updatedCart);
    calculateTotalPrice();
    grandPrice();
}


function displayCartItems() {
    console.warn('here');
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = getCartFromLocalStorage();
    const cartStatus = document.getElementById('empty-cart');

    if (cart && cart.length > 0) {
        cart.forEach((cartItem) => {
            if (cartItem.quantity < 1) {
                cartStatus.style.padding = "20px";
                const updatedCart = cart.filter(item => item.id !== cartItem.id);
                saveCartToLocalStorage(updatedCart);
                return;
            }

            const cartItemElement = createCartItemElement(cartItem);
            cartItemsContainer.appendChild(cartItemElement);
        });
    } else {
        document.getElementById('summary-table').innerHTML = ``;
        document.getElementById('proceed-to-checkout').innerHTML = ``;
        cartStatus.innerHTML = "The cart is empty";
        cartStatus.style.padding = "2rem";
        cartStatus.style.textAlign = "center"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    calculateTotalPrice();
    grandPrice();
    seasonalOffer();
});

const PRODUCT_CARDS = document.getElementById("productCards");
if (PRODUCT_CARDS){
PRODUCT_CARDS.addEventListener("click", (event) => {
    let target = event.target as HTMLElement;
    if (target.classList.contains("add-to-cart")) {
        const productId = target.getAttribute("data-product-id");
        if (productId) {
            const products = JSON.parse(localStorage.getItem("products")!);
            const product = getProductById(productId);
            if (product) {
                addToCart(product);
            }
        }
    }
})};


function createCartItemElement(cartItem : CartProduct) {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    console.log("cartItem", cartItem)

    cartItemElement.innerHTML = `
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

    return cartItemElement;
}

function calculateTotalPrice() {
    const cart = getCartFromLocalStorage();
    const totalPriceContainer = document.getElementById('total-price');

    if (cart && cart.length > 0) {
        const totalPrice = cart.reduce((total, cartItem) => {
            return total + (cartItem.price * cartItem.quantity);
        }, 0);
        totalPriceContainer.innerHTML = `$${totalPrice.toFixed(2)}`;
    } else {
        totalPriceContainer.innerHTML = '';
    }
}

function seasonalOffer() {
    const offerValue = document.getElementById('offer');
    const totalPrice = document.getElementById('total-price');
    console.log(offerValue.innerHTML,)

    if (totalPrice) {
        offerValue.innerHTML = ((parseInt(totalPrice.innerText.replace('$', '')) * 0.20).toFixed(2)).toString();
    } else {
        offerValue.innerHTML = 'N/A'; // set default value for offerValue
    }
}

function grandPrice() : void {
    const deliveryPriceFetch = document.getElementById('delivery');
    const offerPriceFetch = document.getElementById('offer');

    let totalPrice = document.getElementById('total-price');
    let grandPrice: HTMLElement | null = document.getElementById('grand')
    let deliveryPrice = 0;
    let offerPrice = 0;
    
    if (deliveryPriceFetch) {
        deliveryPrice += parseFloat(deliveryPriceFetch.innerText)
    }

    if (offerPriceFetch) {
        offerPrice += parseFloat(offerPriceFetch.innerText)
    }
    console.log(deliveryPrice, offerPrice, grandPrice)

    if (grandPrice && totalPrice)
        grandPrice.innerHTML = ((parseFloat(totalPrice.innerText.replace('$', '')) - offerPrice + deliveryPrice).toFixed(2)).toString()
        console.log(grandPrice.innerHTML)
}

function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById('cart-items').addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('decrease-quantity')) {
        const productId = target.getAttribute('data-product-id');
        if (productId) {
            decreaseQuantity(parseFloat(productId));
        }
    } else if (target.classList.contains('increase-quantity')) {
        const productId = target.getAttribute('data-product-id');
        if (productId) {
            increaseQuantity(parseFloat(productId));
        }
    }
});

function decreaseQuantity(productId : number) {
    let isNull = false; 

    const cart = getCartFromLocalStorage();
    let updatedCart = cart.map((cartItem) => {
        if (cartItem.id === productId) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cartItem.currentPrice -= cartItem.price;
                document.getElementById("price-" + cartItem.id).innerText = '$' + cartItem.currentPrice.toFixed(2);
                document.getElementById("quantity-" + cartItem.id).innerText = cartItem.quantity;
            } else {
                isNull = true;
                return null;
            }
        }
        return cartItem;
    });

    updatedCart = updatedCart.filter((item) => item !== null);

    saveCartToLocalStorage(updatedCart);
    calculateTotalPrice();
    grandPrice();

    if (isNull) {
        window.location.reload()
    }
}

function razorPay() {
    let options = {
        "key": "rzp_test_sXsEb6LoQEVd5E", // Enter the Key ID generated from the Dashboard
        "amount": (parseFloat(document.getElementById('grand').innerHTML) * 100).toFixed(2), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            window.location.href = "success.html";

        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com", 
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };


    let rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    document.getElementById('rzp-button1').onclick = function(e){
        rzp1.open();
        e.preventDefault();
    }
}



