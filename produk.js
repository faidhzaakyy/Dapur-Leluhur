/* =====================================================
   DAPUR LELUHUR
   PRODUK JAVASCRIPT
===================================================== */


/* =====================================================
   DATA PRODUK
===================================================== */

const products = [

    {
        id: 1,

        name: "Teh Herbal Original",

        category: "Teh Herbal",

        price: 15000,

        image: "assets/hero-bg.png",

        description:
            "Teh herbal dengan cita rasa alami yang cocok menemani keseharian.",

        badge: "Favorit"
    },


    {
        id: 2,

        name: "Teh Herbal Jahe",

        category: "Teh Herbal",

        price: 18000,

        image: "assets/hero-bg.png",

        description:
            "Perpaduan teh herbal dan jahe dengan rasa hangat serta aroma yang khas.",

        badge: "Pilihan"
    },


    {
        id: 3,

        name: "Teh Herbal Rempah",

        category: "Teh Herbal",

        price: 20000,

        image: "assets/hero-bg.png",

        description:
            "Racikan herbal dan rempah pilihan dengan cita rasa khas Dapur Leluhur.",

        badge: "Premium"
    }

];



/* =====================================================
   ELEMENT
===================================================== */

const productsGrid =
    document.getElementById("productsGrid");

const emptyProducts =
    document.getElementById("emptyProducts");

const productSearch =
    document.getElementById("productSearch");

const cartCount =
    document.getElementById("cartCount");

const toast =
    document.getElementById("toast");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");



/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}



/* =====================================================
   GET CART
===================================================== */

function getCart() {

    const cart =
        localStorage.getItem("dapurLeluhurCart");

    return cart
        ? JSON.parse(cart)
        : [];

}



/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "dapurLeluhurCart",
        JSON.stringify(cart)
    );

}



/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const cart = getCart();

    const totalItems =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}



/* =====================================================
   SHOW TOAST
===================================================== */

let toastTimer;

function showToast(message) {

    if (!toast) return;

    const toastText =
        toast.querySelector("span");

    if (toastText) {

        toastText.textContent =
            message;

    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}



/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;


    const cart = getCart();


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();

    showToast(
        `${product.name} ditambahkan ke keranjang`
    );

}



/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

    return `

        <article
            class="product-card"
            data-name="${product.name.toLowerCase()}"
        >

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-badge">
                    ${product.badge}
                </span>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>


                <h2 class="product-name">
                    ${product.name}
                </h2>


                <p class="product-description">
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <span class="product-price">
                        ${formatRupiah(product.price)}
                    </span>


                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >

                        <i class="fa-solid fa-cart-plus"></i>

                        Tambah

                    </button>

                </div>

            </div>

        </article>

    `;

}



/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(list = products) {

    if (!productsGrid) return;


    if (list.length === 0) {

        productsGrid.innerHTML = "";

        emptyProducts.style.display =
            "block";

        return;

    }


    emptyProducts.style.display =
        "none";


    productsGrid.innerHTML =
        list.map(createProductCard).join("");

}



/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function searchProducts() {

    const keyword =
        productSearch.value
            .toLowerCase()
            .trim();


    const filtered =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.category
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.description
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    renderProducts(filtered);

}



if (productSearch) {

    productSearch.addEventListener(
        "input",
        searchProducts
    );

}



/* =====================================================
   SEARCH BUTTON NAVBAR
===================================================== */

const searchButton =
    document.getElementById("searchButton");


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            productSearch.focus();

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}



/* =====================================================
   MOBILE MENU
===================================================== */

if (menuToggle && navMenu) {

    menuToggle.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "show"
            );


            const isOpen =
                navMenu.classList.contains(
                    "show"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "show"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}



/* =====================================================
   INITIALIZE
===================================================== */

renderProducts();

updateCartCount();