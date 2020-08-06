function addIngredient() {
  const ingredients = document.querySelector("#ingredients")
  console.log("ingredients:", ingredients)
  const fieldContainer = document.querySelectorAll(".ingredient")
  console.log("fieldContainer:", fieldContainer)

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false

  // Deixa o valor do input vazio
  newField.children[0].value = ""
  ingredients.appendChild(newField)
}
document.querySelector(".add-ingredient").addEventListener("click", addIngredient)

function addPreparation() {
  const preparations = document.querySelector("#preparations")
  const fieldContainer = document.querySelectorAll(".preparation")
  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;
  // Deixa o valor do input vazio
  newField.children[0].value = ""
  preparations.appendChild(newField)
}
document.querySelector(".add-preparation").addEventListener("click", addPreparation)


//Paginação
function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2


    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...")
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)

      oldPage = currentPage
    }

  }
  return pages
}

function createPagination(pagination) {

  const filter = pagination.dataset.filter
  const page = Number(pagination.dataset.page)
  const total = Number(pagination.dataset.total)
  const pages = paginate(page, total)

  let elements = ""

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }
  pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")
if (pagination) {
  createPagination(pagination)
}