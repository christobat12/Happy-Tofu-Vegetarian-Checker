function getFetch(){
  let inputVal = document.getElementById('barcode').value

  if(inputVal.length !== 12) {
    alert(`Please ensure that barcode is 12 characters`)
    return;
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if(data.status === 1 && data.product.ingredients && data.product.image_url) {
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else {
          alert(`Product ${inputVal} not found. Please try another.`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //passing in data.product
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }
  showInfo() {
    document.getElementById('product-img').src = this.image
    document.getElementById('product-name').innerText = this.name
    document.getElementById('ingredient-head').innerText = 'Ingredients'
    document.getElementById('vegetarian-head').innerText = 'Vegetarian'
    document.querySelector('#ingredient-table').classList.remove('hidden')
  }
  listIngredients() {
    let tableRef = document.getElementById('ingredient-table')
    for(let i=1; i < tableRef.rows.length;) { //loop through the all the rows except the first row and delete everything to clear the table
      tableRef.deleteRow(i)
    }
    if(!(this.ingredients == null)) {
        for(let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1)
        let newIngCell = newRow.insertCell(0)
        let newVegCell = newRow.insertCell(1)
        let newIngText = document.createTextNode( 
          this.ingredients[key].text
        )
        let vegStatus = !(this.ingredients[key].vegetarian) ? 'unknown' : this.ingredients[key].vegetarian
        let newVegText = document.createTextNode(vegStatus)
        newIngCell.appendChild(newIngText)
        newVegCell.appendChild(newVegText)
        if (vegStatus === 'no') {
          newVegCell.classList.add('non-veg-item')
        } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
          newVegCell.classList.add('unknown-maybe-item')
        }
        }
      
    }
  }
}
