/* =====================================================
   DAPUR LELUHUR
   CART JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENT
===================================================== */

const cartList =
    document.getElementById("cartList");

const cartLayout =
    document.getElementById("cartLayout");

const emptyCart =
    document.getElementById("emptyCart");

const cartCount =
    document.getElementById("cartCount");

const itemLabel =
    document.getElementById("itemLabel");

const subtotalElement =
    document.getElementById("subtotal");

const totalElement =
    document.getElementById("total");

const summaryItems =
    document.getElementById("summaryItems");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    const cart =
        localStorage.getItem(
            "dapurLeluhurCart"
        );

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
   UPDATE CART COUNT
===================================================== */

function updateCartCount(cart) {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
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


    if (toastText) {

        toastText.textContent =
            message;

    }


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(productId, amount) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        const newCart =
            cart.filter(
                item => item.id !== productId
            );

        saveCart(newCart);

    } else {

        saveCart(cart);

    }


    renderCart();

}


/* =====================================================
   REMOVE ITEM
===================================================== */

function removeItem(productId) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    const newCart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart(newCart);


    if (item) {

        showToast(
            `${item.name} dihapus dari keranjang`
        );

    }


    renderCart();

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const cart = getCart();


    updateCartCount(cart);


    /* EMPTY */

    if (cart.length === 0) {

        if (cartLayout) {

            cartLayout.style.display =
                "none";

        }


        if (emptyCart) {

            emptyCart.style.display =
                "block";

        }


        if (itemLabel) {

            itemLabel.textContent =
                "0 produk";

        }


        if (subtotalElement) {

            subtotalElement.textContent =
                "Rp0";

        }


        if (totalElement) {

            totalElement.textContent =
                "Rp0";

        }


        if (summaryItems) {

            summaryItems.textContent =
                "0";

        }


        return;

    }


    /* SHOW CART */

    if (cartLayout) {

        cartLayout.style.display =
            "grid";

    }


    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    /* TOTAL ITEM */

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    /* SUBTOTAL */

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );


    /* HEADER */

    if (itemLabel) {

        itemLabel.textContent =
            `${totalItems} produk`;

    }


    /* SUMMARY */

    if (subtotalElement) {

        subtotalElement.textContent =
            formatRupiah(subtotal);

    }


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(subtotal);

    }


    if (summaryItems) {

        summaryItems.textContent =
            totalItems;

    }


    /* CART ITEMS */

    if (!cartList) return;


    cartList.innerHTML =
        cart.map(item => {

            const itemTotal =
                item.price * item.quantity;


            return `

                <article class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <span class="cart-item-category">
                            Teh Herbal
                        </span>


                        <h3 class="cart-item-name">
                            ${item.name}
                        </h3>


                        <p class="cart-item-price">
                            ${formatRupiah(item.price)}
                            / produk
                        </p>

                    </div>


                    <div class="cart-item-action">

                        <div class="quantity-control">

                            <button
                                class="quantity-btn"
                                onclick="changeQuantity(${item.id}, -1)"
                                aria-label="Kurangi jumlah"
                            >
                                <i class="fa-solid fa-minus"></i>
                            </button>


                            <span class="quantity-value">
                                ${item.quantity}
                            </span>


                            <button
                                class="quantity-btn"
                                onclick="changeQuantity(${item.id}, 1)"
                                aria-label="Tambah jumlah"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>


                        <span class="item-total">
                            ${formatRupiah(itemTotal)}
                        </span>


                        <button
                            class="remove-btn"
                            onclick="removeItem(${item.id})"
                            aria-label="Hapus produk"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </article>

            `;

        }).join("");

}


/* =====================================================
   CHECKOUT PROTECTION
===================================================== */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function(event) {

            const cart = getCart();


            if (cart.length === 0) {

                event.preventDefault();

                showToast(
                    "Keranjang masih kosong"
                );

            }

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

renderCart();