export function starRating(rate) {
    const STARS_CONTAINER = document.createElement('div');
    STARS_CONTAINER.className = "stars-container";
    const noOfStars = Math.floor(rate);
    for (let i = 0; i < 5; i++) {
        const STAR_CONTAINER = document.createElement('span');
        STAR_CONTAINER.className = "star-container";
        if (i < noOfStars) {
            STAR_CONTAINER.innerHTML = `<span id="fillStars" class="material-symbols-rounded">star</span>`;
        }
        else {
            STAR_CONTAINER.innerHTML = `<span class="material-symbols-rounded">star</span>`;
        }
        STARS_CONTAINER.appendChild(STAR_CONTAINER);
    }
    return STARS_CONTAINER;
}
export function addToCart(prod) {
    console.warn(prod);
    const product = getProductById(JSON.parse(prod));
    console.log(product);
    const cart = getCartItemsFromLocalStorage();
    const existingCartItem = cart.find((cartItem) => cartItem.id === product.id);
    if (existingCartItem) {
        console.log(existingCartItem);
        existingCartItem.quantity++;
    }
    else {
        console.log(existingCartItem);
        cart.push({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            quantity: 1,
            currentPrice: product.price,
        });
    }
    console.log(cart);
    saveCartToLocalStorage(cart);
}
export function displayProductIndividually(productId) {
    const product = getProductById(productId);
    const SHOW_ITEM = getCartItemsFromLocalStorage();
    SHOW_ITEM.push({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
        description: product.description,
        rate: product.rating.rate,
        count: product.rating.count,
        category: product.category
    });
    localStorage.setItem('SHOW_ITEM', JSON.stringify(SHOW_ITEM));
    console.log(SHOW_ITEM);
}
export function getProductById(productId) {
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === parseInt(productId));
}
export function getCartItemsFromLocalStorage() {
    const cartJson = localStorage.getItem("cart");
    return cartJson ? JSON.parse(cartJson) : [];
}
export function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
