/* =====================================================
   DAPUR LELUHUR
   NOTA JAVASCRIPT
===================================================== */


/* =====================================================
   NOMOR WHATSAPP TUJUAN
===================================================== */

const ownerWhatsApp = "6281235991924";


/* =====================================================
   GET ORDER
===================================================== */

const orderData = JSON.parse(
    localStorage.getItem("dapurLeluhurOrder")
);


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
   FORMAT TANGGAL
===================================================== */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =====================================================
   CEK ORDER
===================================================== */

if (!orderData) {

    alert(
        "Data pesanan tidak ditemukan."
    );

    window.location.href =
        "produk.html";

}


/* =====================================================
   TAMPILKAN DATA ORDER
===================================================== */

if (orderData) {

    /* ================================
       ORDER INFO
    ================================= */

    document.getElementById(
        "orderNumber"
    ).textContent =
        orderData.orderNumber;


    document.getElementById(
        "orderDate"
    ).textContent =
        formatDate(orderData.date);


    /* ================================
       CUSTOMER
    ================================= */

    document.getElementById(
        "customerName"
    ).textContent =
        orderData.customer.name;


    document.getElementById(
        "customerPhone"
    ).textContent =
        orderData.customer.phone;


    document.getElementById(
        "customerAddress"
    ).textContent =
        orderData.customer.address;


    /* ================================
       TOTAL
    ================================= */

    document.getElementById(
        "orderTotal"
    ).textContent =
        formatRupiah(orderData.total);


    /* ================================
       CATATAN
    ================================= */

    const noteSection =
        document.getElementById(
            "noteSection"
        );

    const orderNote =
        document.getElementById(
            "orderNote"
        );


    if (
        orderData.customer.note &&
        orderData.customer.note.trim() !== ""
    ) {

        orderNote.textContent =
            orderData.customer.note;

    } else {

        noteSection.style.display =
            "none";

    }


    /* ================================
       PRODUK
    ================================= */

    const orderItems =
        document.getElementById(
            "orderItems"
        );


    orderItems.innerHTML = "";


    orderData.items.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "order-item";


        itemElement.innerHTML = `

            <div>

                <div class="item-name">
                    ${item.name}
                </div>

                <span class="item-price">
                    ${formatRupiah(item.price)}
                    / produk
                </span>

            </div>


            <div class="item-qty">
                ${item.quantity}x
            </div>


            <div class="item-total">
                ${formatRupiah(itemTotal)}
            </div>

        `;


        orderItems.appendChild(
            itemElement
        );

    });

}


/* =====================================================
   WHATSAPP
===================================================== */

const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


if (whatsappBtn) {

    whatsappBtn.addEventListener(
        "click",
        () => {

            if (!orderData) {
                return;
            }


            /* ============================
               CEK NOMOR WA
            ============================ */

            if (
                ownerWhatsApp ===
                "GANTI_DENGAN_NOMOR_LU"
            ) {

                alert(
                    "Masukkan nomor WhatsApp tujuan terlebih dahulu di nota.js"
                );

                return;

            }


            /* ============================
               DAFTAR PRODUK
            ============================ */

            let productMessage = "";


            orderData.items.forEach(
                item => {

                    const itemTotal =
                        item.price *
                        item.quantity;


                    productMessage +=
                        `• ${item.name} x${item.quantity} = ${formatRupiah(itemTotal)}\n`;

                }
            );


            /* ============================
               PESAN WHATSAPP
            ============================ */

            let message =

`Halo Dapur Leluhur 👋

Saya ingin mengonfirmasi pesanan:

📋 *PESANAN BARU*
No. Pesanan: ${orderData.orderNumber}

👤 *Nama:*
${orderData.customer.name}

📱 *No. WhatsApp:*
${orderData.customer.phone}

📍 *Alamat:*
${orderData.customer.address}

🛍️ *Produk:*
${productMessage}
💰 *Total: ${formatRupiah(orderData.total)}*`;


            /* ============================
               CATATAN
            ============================ */

            if (
                orderData.customer.note &&
                orderData.customer.note.trim() !== ""
            ) {

                message +=

`\n📝 *Catatan:*
${orderData.customer.note}`;

            }


            message +=

`\n\nTerima kasih. Saya menunggu konfirmasi pesanan. 🙏`;


            /* ============================
               ENCODE
            ============================ */

            const encodedMessage =
                encodeURIComponent(
                    message
                );


            /* ============================
               OPEN WHATSAPP
            ============================ */

            const whatsappURL =
                `https://wa.me/${ownerWhatsApp}?text=${encodedMessage}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


/* =====================================================
   KOSONGKAN CART
===================================================== */

localStorage.removeItem(
    "dapurLeluhurCart"
);