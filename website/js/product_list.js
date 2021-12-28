init();
function init() {
    getProducts().then((value) => update_catalog(value));
}

async function getProducts() {
    return await fetch("products.json")
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

function update_catalog(products) {
    html = "";

    // Updating the html of the colors tab
    if (products.length > 0) {
        for (let i = 0; i < products.length; i++) {
            html +=
                '<div class="col-md-3 p-5">' +
                '<div class="product tumbnail border thumbnail-3">' +
                '<a href="edit_product.html?model=' +
                products[i].model_3d +
                '">' +
                '<img class="foto-produto" src="' +
                products[i].img +
                '" alt="' +
                products[i].name +
                '" />' +
                "</a>" +
                '<div class="caption">' +
                '<h6><a href="#">' +
                products[i].name +
                "</a></h6>" +
                '<span class="price sale">' +
                products[i].basePrice +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>";
        }
    } else {
        html = '<div class="col-12"><div class="item_color_card"><h4>Sem Produtos</h4></div></div>';
    }

    document.getElementById("catalog").innerHTML = html;

    // // Find all color elements of the right side tab
    // var elements = document.getElementsByClassName("item_color_card");

    // // Add events that will be activated by the user interactions
    // for (let i = 0; i < elements.length; i++) {
    //     // Not using addEventListener because each element just need one
    //     // action for each event
    //     elements[i].onclick = () => change_item_color(i, true);
    //     elements[i].onmouseover = () => change_item_color(i, false);
    //     elements[i].onmouseout = () => reset_item_color();
    // }
}
