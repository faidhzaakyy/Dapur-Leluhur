/* =====================================================
   DAPUR LELUHUR
   CHECKOUT JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENT
===================================================== */

const checkoutForm =
    document.getElementById("checkoutForm");

const summaryProducts =
    document.getElementById("summaryProducts");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const summarySubtotal =
    document.getElementById("summarySubtotal");

const summaryTotal =
    document.getElementById("summaryTotal");

const cartCount =
    document.getElementById("cartCount");

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

    }, 2500);

}


/* =====================================================
   CREATE ORDER NUMBER
===================================================== */

function generateOrderNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );


    return `DL-${year}${month}${day}-${random}`;

}


/* =====================================================
   RENDER SUMMARY
===================================================== */

function renderSummary() {

    const cart = getCart();


    updateCartCount(cart);


    /* CART KOSONG */

    if (cart.length === 0) {

        summaryProducts.innerHTML = `

            <div class="empty-summary">

                <p>
                    Keranjang kamu masih kosong.
                </p>

                <a href="produk.html">
                    Kembali ke produk
                </a>

            </div>

        `;


        summaryQuantity.textContent = "0";

        summarySubtotal.textContent = "Rp0";

        summaryTotal.textContent = "Rp0";

        return;

    }


    /* TOTAL */

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );


    summaryQuantity.textContent =
        totalQuantity;


    summarySubtotal.textContent =
        formatRupiah(subtotal);


    summaryTotal.textContent =
        formatRupiah(subtotal);


    /* PRODUCTS */

    summaryProducts.innerHTML =
        cart.map(item => {

            const itemTotal =
                item.price * item.quantity;


            return `

                <div class="summary-product">

                    <div class="summary-product-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                    </div>


                    <div>

                        <div class="summary-product-name">
                            ${item.name}
                        </div>

                        <div class="summary-product-quantity">
                            ${item.quantity} ×
                            ${formatRupiah(item.price)}
                        </div>

                    </div>


                    <div class="summary-product-total">
                        ${formatRupiah(itemTotal)}
                    </div>

                </div>

            `;

        }).join("");

}


/* =====================================================
   VALIDATE PHONE
===================================================== */

function validatePhone(phone) {

    const cleaned =
        phone.replace(
            /[\s\-()+]/g,
            ""
        );


    return /^0?8\d{9,12}$/.test(
        cleaned
    );

}


/* =====================================================
   FORM SUBMIT
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const cart = getCart();


            /* CHECK CART */

            if (cart.length === 0) {

                showToast(
                    "Keranjang kamu masih kosong."
                );

                setTimeout(() => {

                    window.location.href =
                        "produk.html";

                }, 1000);

                return;

            }


            /* GET FORM DATA */

            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const customerPhone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const customerAddress =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            const customerNote =
                document
                    .getElementById(
                        "customerNote"
                    )
                    .value
                    .trim();


            /* VALIDATE NAME */

            if (customerName.length < 3) {

                showToast(
                    "Nama lengkap belum benar."
                );

                document
                    .getElementById(
                        "customerName"
                    )
                    .focus();

                return;

            }


            /* VALIDATE PHONE */

            if (!validatePhone(customerPhone)) {

                showToast(
                    "Nomor WhatsApp belum benar."
                );

                document
                    .getElementById(
                        "customerPhone"
                    )
                    .focus();

                return;

            }


            /* VALIDATE ADDRESS */

            if (customerAddress.length < 10) {

                showToast(
                    "Mohon isi alamat dengan lengkap."
                );

                document
                    .getElementById(
                        "customerAddress"
                    )
                    .focus();

                return;

            }


            /* TOTAL */

            const total =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        (
                            item.price *
                            item.quantity
                        ),
                    0
                );


            /* ORDER */

            const order = {

                orderNumber:
                    generateOrderNumber(),

                date:
                    new Date().toISOString(),

                customer: {

                    name:
                        customerName,

                    phone:
                        customerPhone,

                    address:
                        customerAddress,

                    note:
                        customerNote

                },

                items:
                    cart,

                total:
                    total

            };


            /* SAVE ORDER */

            localStorage.setItem(
                "dapurLeluhurOrder",
                JSON.stringify(order)
            );


            /* GO TO RECEIPT */

            window.location.href =
                "nota.html";

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

renderSummary();