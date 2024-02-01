"use strict";
let cart = [];
let cartTotal = 0;
const cartDom = document.querySelector(".cart");
const addToCartBtnDom = document.querySelectorAll(
  "[data-action='add-to-cart']"
);

addToCartBtnDom.forEach((addToCartBtn) => {
  addToCartBtn.addEventListener("click", () => {
    const productDom = addToCartBtn.parentNode.parentNode;
    const product = {
      img: productDom.querySelector(".product-img").getAttribute("src"),
      name: productDom.querySelector(".product-name").innerText,
      price: productDom.querySelector(".product-price").innerText,
      quantity: 1,
    };

    const isInCart =
      cart.filter((cartItem) => cartItem.name === product.name).length > 0;
    if (isInCart === false) {
      cartDom.insertAdjacentHTML("beforeend", createCartItems(product));

      createCartFooter();

      addToCartBtn.innerText = "Trong giỏ hàng";
      addToCartBtn.disabled = true;
      cart.push(product);

      const cartItemsDom = document.querySelectorAll(".cart-items");
      cartItemsDom.forEach((cartItemDom) => {
        if (
          cartItemDom.querySelector(".cart_item_name").innerText ===
          product.name
        ) {
          let cartItemQty = parseInt(
            cartItemDom.querySelector(".cart_item_quantity").innerText
          );
          let cartItemPrice = parseInt(
            cartItemDom.querySelector(".cart_item_price").innerText
          );
          cartTotal += cartItemQty * cartItemPrice;
          document.querySelector(".pay").innerText = cartTotal + ",000 VNĐ";

          increaseItemInCart(cart, product, cartItemDom, cartTotal);
          decreaseItemInCart(cart, product, cartItemDom, cartTotal);

          //remove item in cart
          cartItemDom
            .querySelector("[data-action='remove-item']")
            .addEventListener("click", () => {
              cart.forEach((cartItem) => {
                if (cartItem.name == product.name) {
                  cartTotal -= parseInt(
                    cartItemDom.querySelector(".cart_item_price").innerText
                  );
                  document.querySelector(".pay").innerText =
                    cartTotal + ",000 VNĐ";
                  cartItemDom.remove();
                  cart = cart.filter(
                    (cartItem) => cartItem.name !== product.name
                  );
                }
                if (cart.length < 1) {
                  document.querySelector(".cart-footer").remove();
                }
              });
            });

          //clear cart
          document
            .querySelector("[data-action='clear-cart']")
            .addEventListener("click", () => {
              cartItemDom.remove();
              cart = [];
              cartTotal = 0;
              if (document.querySelector(".cart-footer") !== null) {
                document.querySelector(".cart-footer").remove();
              }
              addToCartBtn.innerText = "Thêm vào giỏ hàng";
              addToCartBtn.disabled = false;
            });

          //checkout
          document
            .querySelector("[data-action='check-out']")
            .addEventListener("click", () => {
              alert("Thanh toán thành công");
              window.location.reload();
            });
        }
      });
    }
  });
});

function decreaseItemInCart(cart, product, cartItemDom, cartTotal) {
  cartItemDom
    .querySelector("[data-action='decrease-item']")
    .addEventListener("click", () => {
      cart.forEach((cartItem) => {
        if (cartItem.name === product.name) {
          cartItemDom.querySelector(".cart_item_quantity").innerText =
            --cartItem.quantity;
          cartItemDom.querySelector(".cart_item_price").innerText =
            parseInt(cartItem.quantity) * parseInt(cartItem.price) + ",000 VNĐ";
          cartTotal = cartItemDom.querySelector(".cart_item_price").innerText;
          document.querySelector(".pay").innerText = cartTotal;
        }
      });
    });
}

function increaseItemInCart(cart, product, cartItemDom, cartTotal) {
  cartItemDom
    .querySelector("[data-action='increase-item']")
    .addEventListener("click", () => {
      cart.forEach((cartItem) => {
        if (cartItem.name === product.name) {
          cartItemDom.querySelector(".cart_item_quantity").innerText =
            ++cartItem.quantity;
          cartItemDom.querySelector(".cart_item_price").innerText =
            parseInt(cartItem.quantity) * parseInt(cartItem.price) + ",000 VNĐ";
          cartTotal += parseInt(cartItem.price);
          document.querySelector(".pay").innerText = cartTotal + ",000 VNĐ";
        }
      });
    });
}

function createCartFooter() {
  if (document.querySelector(".cart-footer") === null) {
    cartDom.insertAdjacentHTML(
      "afterend",
      `<div class="d-flex flex-row shadow-sm card cart-footer mt-2 mb-3 animated flipInX">
                <div class="p-2">
                  <button class="btn badge-danger" type="button" data-action="clear-cart">Xóa giỏ hàng
                  </button>
                </div>
                <div class="p-2 ml-auto">
                  <button class="btn badge-dark" type="button" data-action="check-out">Trả <span class="pay"></span></button>
                </div>
              </div>`
    );
  }
}

function createCartItems(product) {
  return `<div class="d-flex flex-row shadow-sm cart cart-items mt-2 mb-3 animated flipInX">
            <div class="p-2">
                <img src="${product.img}" alt="${product.name}" style="max-width: 50px;">
            </div>
            <div class="p-2 mt-3">
                <p class="text-info cart_item_name">${product.name}</p>
            </div>
            <div class="p-2 mt-3">
                <p class="text-success cart_item_price">${product.price}</p>
            </div>
            <div class="p-2 mt-3 ml-auto">
                <button class="btn badge badge-secondary" type="button" data-action="increase-item">&plus;</button>
            </div>
            <div class="p-2 mt-3">
                <p class="text-success cart_item_quantity">${product.quantity}</p>
            </div>
            <div class="p-2 mt-3">
                <button class="btn badge badge-info" type="button" data-action="decrease-item">&minus;</button>
            </div>
            <div class="p-2 mt-3">
                <button class="btn badge badge-danger" type="button" data-action="remove-item">&times;</button>
            </div>
        </div>`;
}
