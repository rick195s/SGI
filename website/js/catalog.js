init();
function init() {
    getProducts().then((value) => update_catalog(value));
}

function update_catalog(products) {
    html = "";

    // Updating the html of the colors tab
    if (products.length > 0) {
        for (let i = 0; i < products.length; i++) {
            html +=
                '<a href="edit_product.html?model=' +
                products[i].name +
                '">' +
                '<div class="card" >' +
                '<img class="card-img-top foto-produto" src="' +
                products[i].img +
                '" alt="' +
                products[i].display_name +
                '">' +
                '<div class="card-body">' +
                '<p class="card-category">' +
                products[i].category +
                "</p>" +
                '<p class="card-text">' +
                products[i].display_name +
                "</p>" +
                '<span class="price sale">' +
                products[i].basePrice +
                " €</span>" +
                "</div>" +
                "</div>" +
                "</a>";
        }
    } else {
        html = '<div class="col-12"><div class="item_color_card"><h4>Sem Produtos</h4></div></div>';
    }

    document.getElementById("catalog").innerHTML = html;
}
