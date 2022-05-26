export default class Products {
  /**
  * 
  * @param {array} productsTab 
  * @returns documentFragment
  */

  HTMLallProducts(productsTab) {
    const fragment = new DocumentFragment()
    for (let product of productsTab) {
      const a = document.createElement("a")
      const article = document.createElement("article")
      const h3 = this.createElementTag("h3", product.name)
      const img = this.createImageTag("img", product.imageUrl, product.altTxt)
      const p = this.createElementTag("p", product.description)

      a.href = `./product.html?id=${product._id}`

      h3.classList.add("productName")
      p.classList.add("productDescription")

      article.appendChild(img)
      article.appendChild(h3)
      article.appendChild(p)

      a.appendChild(article)
      fragment.appendChild(a)

    }

    return fragment
  }

  /**
   * 
   * @param {string} elementTag 
   * @param {string} source 
   * @param {string} altTexte 
   * @returns HTMLElement
   */
  createImageTag(elementTag, source, altTexte) {
    const tag = document.createElement(elementTag)
    tag.src = source
    tag.alt = altTexte
    return tag
  }

  /**
    * 
    * @param {string} elementTag 
    * @param {string} content 
    * @returns HTMLElement
    */
  createElementTag(elementTag, content) {
    const tag = document.createElement(elementTag)
    tag.textContent = content
    return tag
  }

  /**
   * 
   * @param {string} elementTag 
   * @param {string} value 
   * @param {string} text 
   * @returns HTMLElement
   */
  createOptionTag(elementTag, value, text) {
    const tag = document.createElement(elementTag)
    tag.value = value
    tag.textContent = text
    return tag
  }

  /**
   * 
   * @param {array} listOption 
   * @returns array[HTMLElements]
   */
  insertOption(listOption) {
    let list = []
    for (let option of listOption) {
      list.push(this.createOptionTag("option", option, option))
    }
    return list
  }

  /**
   * 
   * @param {string} idParametre 
   * @param {string} color 
   * @param {string} quantity 
   * @returns void
   */
  addToBasket(idParametre, color, quantity) {
    const qtt = parseInt(quantity)
    let product = {}
    let productList = []
    const getItem = localStorage.getItem("produit")

    if (!color && (qtt <= 0 || qtt > 100)) {
      alert("Vous devez choisir une couleur et une quantité")
      return
    }

    if (!color) {
      alert("Vous devez choisir une couleur")
      return
    }
    if (qtt <= 0 || qtt > 100) {
      alert("Vous devez saisir une quantité selon l'intervalle indiqué")
      return
    }

    product = { id: idParametre, color, qtt }

    if (!getItem) {
      productList.push(product)
      localStorage.setItem("produit", JSON.stringify(productList))
    }

    if (getItem) {
      const resultParse = JSON.parse(getItem)
      resultParse.push(product)
      localStorage.setItem("produit", JSON.stringify(resultParse))
    }
  }
}