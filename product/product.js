let allProduct = JSON.parse(localStorage.getItem('amalProduct')) || []


const addToCart = (fresh1, price, kilo) =>{
    const productObj = {
        name : fresh1,
        prices: price,
        kilos: kilo
    }
    allProduct.push(productObj)
    console.log(allProduct);
    cartCount.innerHTML = allProduct.length
    
    // localStorage.setItem('amalProduct', JSON.stringify(allProduct))
}

console.log(allProduct);


