const cartBtn = document.getElementById('cartBtn');
const products = document.getElementsByClassName('product');
const cart = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkoutBtn');

const cartItems = [];
let prod;
cartBtn.addEventListener('click', () => {
  cart.classList.toggle('show');
  document.querySelector('.products').style.display = cart.classList.contains('show') ? 'none' : 'flex';
    displayCart();
});
async function getproduct(){
    prod = await fetch('https://dummyjson.com/products');
    prod = await prod.json();
    prod = prod.products;
}
getproduct();
function addToCart(id){
    const foundIndex = cartItems.findIndex(obj => obj.id === id);

  if (foundIndex !== -1) {
    cartItems[foundIndex].quantity += 1;
  } else {
    cartItems.push({
        id : id,
        name : prod[id-1].title,
        price : prod[id-1].price,
        quantity: 1    
    })
  }
}
let totalPrice=0;
function displayCart(){
    console.log("display")
    let cart = document.querySelector('.cart')
    cart.innerHTML="";
    totalPrice = 0;
    for(let i of cartItems){
        let cartdiv = document.createElement('div');
        totalPrice += (i.price*i.quantity);
        cartdiv.innerHTML = `<div class="cart_item">
                    <span style="font-size:18px">${i.name}</span>
                    <span>Price: ${i.price}</span>
                    <span>Quant: ${i.quantity}</span>
                    <button class="remove" onClick = "removeItem(${i.id})">-</button>
                    </div>`;
                    cart.append(cartdiv);
    }
}
function removeItem(id){
    const foundIndex = cartItems.findIndex(obj => obj.id === id);
    if (foundIndex !== -1) {
      cartItems[foundIndex].quantity -= 1;
      if(cartItems[foundIndex].quantity==0){
        cartItems.splice(foundIndex, 1);

      }
    }
    displayCart();
}
document.getElementById('checkoutBtn').addEventListener('click',()=>{
    window.alert(`Thankyou for shopping. Your total price is ${totalPrice}`)
})
async function populateProduct(){
    let product = await fetch('https://dummyjson.com/products');
    product = await product.json()
    product = product.products;
    for(let i of product){
        let prod = document.createElement('div');
        prod.classList.add('main_div');
        prod.innerHTML = `<div class="product" style = "height:400px; " id=${i.id}>
        <div class="img_con">
        <button class="previous" onClick= "prevImage(${i.id})"> << </button>
        <img src=${i.images[0]} style = "height:200px; width:200px;" id="0"></img>
        <button id="next" onClick = "nextBtn(${i.id})"> >> </button>
        </div>
        <div class="card_footer">
        <h3>${i.title}</h3>
        <p>Price: $${i.price}</p>
        <button class="addToCartBtn" onClick ="addToCart(${i.id})">Add to Cart</button>
        </div>
    </div>`
      document.querySelector('.products').append(prod);
      
    }
}
    populateProduct();

async function prevImage(id){
    const prevBtn = document.getElementById(id);
    const img = prevBtn.querySelector('img');
    let img_id = img.getAttribute('id');
    const res = await fetch('https://dummyjson.com/products');
    const result = await res.json();
    const images = result.products[id-1].images;
    if(img_id==0){
        img_id = images.length -1;
    }
    else{
        img_id--;
    }
    img.setAttribute('src',images[img_id]);
    img.setAttribute('id',img_id);
}
async function nextBtn(id){
    const prevBtn = document.getElementById(id);
    const img = prevBtn.querySelector('img');
    let img_id = img.getAttribute('id');
    const res = await fetch('https://dummyjson.com/products');
    const result = await res.json();
    const images = result.products[id-1].images;
    if(img_id==images.length-1){
        img_id = 0;
    }
    else{
        img_id++;
    }
    img.setAttribute('src',images[img_id]);
    img.setAttribute('id',img_id);
}