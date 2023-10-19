import { starRating } from "./utilities.js";
import { displayProductIndividually } from "./utilities.js";
document.getElementById("cart-visit").addEventListener("click", () => {
    window.location.href = 'cart.html';
});
function individualProduct() {
    const INDIVIDUAL_CONTAINER = document.getElementById('individual-container');
    const PRODUCT = JSON.parse(localStorage.getItem('SHOW_ITEM'));
    const lastItem = PRODUCT.pop();
    console.log(lastItem);
    // retrieve the category of the current product from local storage
    const currentCategory = JSON.parse(localStorage.getItem('SHOW_ITEM'));
    console.log(currentCategory[0]);
    // filter the products array to get the products with the same category as the current product
    const relatedProducts = JSON.parse(localStorage.getItem('products')).filter(product => {
        console.log(product.category, lastItem.category);
        return product.category === lastItem.category && product.id !== lastItem.id;
    });
    // create the individual item section
    const INDIVIDUAL_ITEM = document.createElement('div');
    INDIVIDUAL_ITEM.classList.add('indi-item');
    INDIVIDUAL_ITEM.innerHTML = `
    <div class="indi-section-container d-flex justify-content-between">
        <div class="indi-img-container">
            <img src="${lastItem.image}" class="indi-img" alt="...">
        </div>
        <div class="indi-text d-flex flex-column">
            <div class="indi-info">
                <p class="indi-item-title font-weight-bold">${lastItem.title}</p>
                <p class="indi-item-desc">${lastItem.description}</p>
                <p class="indi-item-ratings d-flex align-items-center" id="ratings">${starRating(lastItem.rate).innerHTML}<span class="rating-count">(${lastItem.count} reviews)</span></p>
                <p class="indi-item-price" id="price">$${lastItem.price}</p>
            </div>
            <div class="coupons d-flex">
                <img class="coupon-image" src="assets/images/C1.png">
                <img class="coupon-image" src="assets/images/C2.png">
                <img class="coupon-image" src="assets/images/C3.png">
                <img class="coupon-image" src="assets/images/C4.png">
            </div>
            <button class="add-to-cart-button btn btn-primary bg-green primary-color-black">Add to Cart</button>   
        </div>
    </div>
`;
    console.log(relatedProducts);
    // create the related products section
    const RELATED_PRODUCTS_SECTION = document.createElement('div');
    RELATED_PRODUCTS_SECTION.innerHTML = `
    <div class="related-products-container mb-5">
        <h4 class="related-products">Related Products</h4>
        <div class="row" id="productCards"></div>
    </div>
`;
    const relatedProductsContainer = RELATED_PRODUCTS_SECTION.querySelector('#productCards');
    relatedProducts.forEach(product => {
        const CARD = document.createElement('div');
        CARD.classList.add('col-md-4', 'mb-4', 'col-lg-3');
        console.log(product);
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
        if (imageLink) {
            imageLink.addEventListener("click", (event) => {
                event.preventDefault();
                displayProductIndividually(product.id);
                window.location.href = `product-details.html?id=${product.id}`;
            });
            relatedProductsContainer.appendChild(CARD);
        }
    });
    // add the individual item and related products sections to the page
    INDIVIDUAL_CONTAINER.appendChild(INDIVIDUAL_ITEM);
    INDIVIDUAL_CONTAINER.appendChild(RELATED_PRODUCTS_SECTION);
}
individualProduct();
