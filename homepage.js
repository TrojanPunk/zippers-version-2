var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { starRating } from "./utilities.js";
import { addToCart } from "./utilities.js";
import { displayProductIndividually } from "./utilities.js";
import { getProductById } from "./utilities.js";
// Event Listeners for all the categories
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('categoryAll').addEventListener('click', () => {
        localStorage.removeItem('selectedCategory');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryMens').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'men\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryWomens').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'women\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryHardware').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'electronics');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('mens-card').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'men\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('womens-card').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'women\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('hardware-card').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'electronics');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.querySelector('.material-symbols-outlined').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    const PRODUCT_CARDS = document.getElementById("productCards");
    if (PRODUCT_CARDS) {
        document.getElementById("productCards").addEventListener("click", (event) => {
            const TARGET = event.target;
            if (TARGET.classList.contains("add-to-cart")) {
                const PRODUCT_ID = TARGET.getAttribute("data-product-id");
                if (PRODUCT_ID) {
                    // Get the product details
                    const product = getProductById(PRODUCT_ID);
                    // Add the product to the cart
                    addToCart(product.id);
                    // Redirect to the cart page
                    window.location.href = 'cart.html';
                }
            }
        });
    }
    ;
    document.querySelector('.navbar-brand').addEventListener('click', () => {
        localStorage.removeItem('selectedCategory');
        window.location.href = 'index.html';
    });
});
function sortProducts(PRODUCTS, SORT_BY) {
    console.log("inside", SORT_BY);
    switch (SORT_BY) {
        case "rating":
            return PRODUCTS.sort((a, b) => b.rating.rate - a.rating.rate);
        case "reviews":
            console.log("Hello", PRODUCTS.sort((a, b) => b.rating.count - a.rating.count));
            return PRODUCTS.sort((a, b) => b.rating.count - a.rating.count);
        case "name":
            return PRODUCTS.sort((a, b) => a.title.localeCompare(b.title));
        case "price":
            return PRODUCTS.sort((a, b) => b.price - a.price);
        default:
            return PRODUCTS;
    }
}
const SORT_BUTTON = document.getElementById("sort-button");
SORT_BUTTON.addEventListener("click", () => {
    const SORT_BY = document.getElementById("sort-by").value;
    console.log(SORT_BY);
    const PRODUCTS = JSON.parse(localStorage.getItem("products"));
    const SORTED_PRODUCTS = sortProducts(PRODUCTS, SORT_BY);
    console.log("sorted", SORTED_PRODUCTS);
    displayProducts(SORTED_PRODUCTS);
});
function fetchAndDisplayProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RESPONSE = yield fetch('https://fakestoreapi.com/products');
            if (!RESPONSE.ok) {
                throw new Error('Failed to fetch data');
            }
            const PRODUCTS = yield RESPONSE.json();
            localStorage.setItem('products', JSON.stringify(PRODUCTS));
            console.log(PRODUCTS);
            displayProducts(PRODUCTS);
        }
        catch (error) {
            console.error(error);
        }
    });
}
// Displaying the products using the local storage
function displayProducts(PRODUCTS) {
    const PRODUCT_CARDS_CONATINER = document.getElementById('productCards');
    const SELECTED_CATEGORY = localStorage.getItem('selectedCategory');
    const FILTERED_PRODUCTS = SELECTED_CATEGORY
        ? PRODUCTS.filter(product => product.category === SELECTED_CATEGORY)
        : PRODUCTS;
    PRODUCT_CARDS_CONATINER.innerHTML = '';
    FILTERED_PRODUCTS.forEach((product) => {
        const CARD = document.createElement('div');
        CARD.classList.add('col-md-4', 'mb-4', 'col-lg-3');
        const prod = JSON.stringify(product);
        CARD.innerHTML = `
            <div class="card" data-product-id="${product.id}">
                <div class="image-container">
                    <a href="product-details.html?id=${product.id}"><img src="${product.image}" class="card-img-top" alt="..."></a>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <div class="card-details-button d-flex justify-content-center flex-column align-items-center">
                        <div class="prod-details d-flex justify-content-center flex-column align-items-center">
                            <p class="card-text d-flex align-items-center" id="ratings">${starRating(product.rating.rate).innerHTML}<span class="rating-count">(${product.rating.count} reviews)</span></p>
                            <p class="card-text" id="price">$${product.price}</p>
                        </div>

                        <button id="add-cart-button" class="btn btn-primary add-to-cart d-flex justify-content-center align-items-center p-20" onclick="addToCart(${product.id})" data-product-id="${product.id}">
                            <span href="cart.html" class="material-symbols-rounded">
                                add_shopping_cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        const imageLink = CARD.querySelector(".card-img-top");
        imageLink.addEventListener("click", (event) => {
            event.preventDefault();
            displayProductIndividually(product.id);
            window.location.href = `product-details.html?id=${product.id}`;
        });
        PRODUCT_CARDS_CONATINER.appendChild(CARD);
    });
}
fetchAndDisplayProducts();
