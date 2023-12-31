const apiUrl = `https://striveschool-api.herokuapp.com/api/product/`
const apiKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGJlZWI0MDVjYWRlZDAwMTQxOGRiMjciLCJpYXQiOjE2OTAyNDExODYsImV4cCI6MTY5MTQ1MDc4Nn0.mB1zRhDN0FxjeCx5s4TJGPiQcumHAjYApLoZf7manHQ
`

const form = document.getElementById("user-form")
const idProductNuovo = document.getElementById('prodotto-id')
const nameInput = document.getElementById("name")
const descriptionInput = document.getElementById("description")
const brandInput = document.getElementById("brand")
const imageUrlInput = document.getElementById("image-url")
const priceInput = document.getElementById("price")




form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const isFormValid = handleFormValidation()
    if(!isFormValid) return false

    // checktxt()
    const product = {
        name: nameInput.value,
        description: descriptionInput.value,
        brand: brandInput.value,
        imageUrl: imageUrlInput.value,
        price: priceInput.value
    }

    try {
        if(idProductNuovo.value === "" ){
            const response = await fetch(apiUrl, {
                method : 'POST',
                body : JSON.stringify(product),
                headers : new Headers ({
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-type" : 'application/json; charset=UTF-8'
                })
            })
            window.location.href = 'backend.html?status=aggiunta-prodotto'
        } else  {
            const risposta = await fetch(`${apiUrl}${idProductNuovo.value}`, {
                method: 'PUT',
                body: JSON.stringify(product),
                headers: new Headers ({
                    "Authorization": `Bearer ${apiKey}`,
                    'Content-type': 'application/json; charset=UTF-8'
                })
            })
            if (risposta.ok) {
                window.location.href = 'backend.html?status=edit-ok'
            } else {
                alert('Errore durante la modifica dell\'prodotto')
            }
        } 
    } catch (error) {
        console.log(error);
    }
    checktxt()
})

async function getToken () {
    try{
        const response = await fetch (apiUrl, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
    })
    const data = await response.json()
    tableBody(data)
    }
    catch (error){
        console.log('Errore nel recupero del prodotto:', error);
    }
}

getToken()

function tableBody(product) {
    const tableProd = document.getElementById('table-body');
    tableProd.innerHTML = '';
    product.forEach((element) => {
        const truncatedId = element._id.length > 20 ? element._id.substring(0, 17) + '...' : element._id;
        const truncatedName = element.name.length > 20 ? element.name.substring(0, 17) + '...' : element.name;
        const truncatedDescription = element.description.length > 30 ? element.description.substring(0, 27) + '...' : element.description;
        const truncatedBrand = element.brand.length > 30 ? element.brand.substring(0, 27) + '...' : element.brand;
        const truncatedImageUrl = element.imageUrl.length > 30 ? element.imageUrl.substring(0, 27) + '...' : element.imageUrl;
        const truncatedPrice = element.price.length > 30 ? element.price.substring(0, 27) + '...' : element.price;
        const truncatedUserId = element.userId.length > 30 ? element.userId.substring(0, 27) + '...' : element.userId;
        const truncatedCreatedAt = element.createdAt.length > 20 ? element.createdAt.substring(0, 17) + '...' : element.createdAt;
        const truncatedUpdatedAt = element.updatedAt.length > 20 ? element.updatedAt.substring(0, 17) + '...' : element.updatedAt;
        
        const row = `
        <tr>
            <td id="prodotto-id" class="td-body col">${truncatedId}</td>
            <td class="td-body col">${truncatedName}</td>
            <td class="td-body col">${truncatedDescription}</td>
            <td class="td-body col">${truncatedBrand}</td>
            <td class="td-body col">${truncatedImageUrl}</td>
            <td class="td-body col">${truncatedPrice}</td>
            <td class="td-body col">${truncatedUserId}</td>
            <td class="td-body col">${truncatedCreatedAt}</td>
            <td class="td-body col">${truncatedUpdatedAt}</td>
            <td class="td-body col">
                <button class="btn btn-danger btn-xs" onclick="deleteProduct('${element._id}')">Elimina</button>
                <button class="btn btn-dark btn-xs" onclick="getProductData('${element._id}')">Modifica</button>
            </td>
        </tr>
        `;
        tableProd.insertAdjacentHTML('beforeend', row);
    });
}


async function deleteProduct(deleteProductId) {
    if (confirm('Sei siuro di voler eliminare questo Prodotto?')) {
    try {
        await fetch(`${apiUrl}${deleteProductId}`, { 
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-type" : 'application/json; charset=UTF-8'
                },
            method: 'DELETE'} );
        window.location.href = 'backend.html?status=delete-ok'
        } catch (error) {
            console.log('Errore durante cancellazione di questo Prodotto: ', error);
        }
    }
}

// function titoloPage (titolo) {
//     const titlePage = document.getElementById(`page-title`)
//     titlePage.textContent = titolo ? `Modifica Prodotto` : `Crea Prodotto`
// }

function titoloPage(titolo) {
    const titlePage = document.getElementById(`page-title`);
    const newTitle = titolo ? `Modifica Prodotto` : `Nuovo Prodotto`;
    titlePage.textContent = newTitle;
    history.pushState(null, newTitle, `?action=${newTitle}`);
}


function goBack() {
    window.location.href = 'index.html'
}

async function getProductData(idProdotto) {
    try {
        const response = await fetch(`${apiUrl}${idProdotto}`,{
            headers: {
                "Authorization" : `Bearer ${apiKey}`
        }
    })
    const product = await response.json()
        idProductNuovo.value = product._id
        nameInput.value = product.name
        descriptionInput.value = product.description
        brandInput.value = product.brand
        imageUrlInput.value  = product.imageUrl
        priceInput.value  = product.price
    }catch (error) {
        console.log('Errore nel recupero degli prodotti: ', error);
    }
    // buildPageTitle(nameInput)
    titoloPage (idProdotto)
    }


// function buildPageTitle(nameInput) {
//     const pageTitle = document.getElementById('page-title')
//     pageTitle.textContent = nameInput ? 'Modifica utente' : 'Crea nuovo utente'
// }

//autenticazione 
// async function rinnovoToken() {

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             endpoint: `https://striveschool-api.herokuapp.com/api/account/login`,
//             requestbody:
//             {
//             "username": `max.cossu@hotmail.com`,
//             "password": 'Massimo85!'
//             }
//         })
//     }  
//     catch (error) {
//         console.log('Errore nel recupero della password ', error);
//     } 
// }

// windows.onload = function () {
    
// }


// function checktxt() {

//     if((nameInput.value == "") || (nameInput.value == "undefined") || (descriptionInput.value == "") || (descriptionInput.value == "undefined")  || (brandInput.value == "") || (brandInput.value == "undefined")) {


//         // const pAllert = document.createElement("p")
//         // const allertContent = document.createTextNode("Inserisci il testo")
//         // pAllert.appendChild(allertContent)
        
//         // alert("Inserisci il testo");
//         document.nameInput.focus()
//         // document.descriptionInput.focus()
//         // document.brandInput.focus()
//         return false
//     }
    
// }

function validateForm() {
    const errors = {}

    const nameValue = document.getElementById('name').value
    const descriptionValue = document.getElementById('description').value
    const brandValue = document.getElementById('brand').value
    const imageUrlValue = document.getElementById('image-url').value
    const priceValue = document.getElementById('price').value

    if (!nameValue) errors.name = "ERRORE, devi inserire il nome"
    else errors.name = ""
    if (!descriptionValue) errors.description = "ERRORE, devi inserire una descrizione"
    else errors.description = ""
    if (!brandValue) errors.brand = "ERRORE, devi inserire la marca"
    else errors.brand = ""

    if (!imageUrlValue) errors.url = "ERRORE, devi inserire una Url"
    else if (!imageUrlValue.startsWith("http")) errors.url = "ERRORE, devi inserire una Url"
    else errors.url = ""
    if (isNaN(priceValue)) errors.price = "ERRORE, devi inserire il prezzo in cifre"
    else if (!priceValue) errors.price = "ERRORE, devi inserire il prezzo"
    else errors.price = ""

    return {
        errors,
        isValid: Object.values(errors).every(value => value === "")
    }
}

function handleFormValidation() {
    const validation = validateForm()
    let isValid = true;

    if (!validation.isValid) {
        for (const key in validation.errors){

        const elementError = document.getElementById(`${key}-alert`)
        elementError.textContent = '';
        elementError.textContent = validation.errors[key];
        }
        isValid = false;
    }
    return isValid
}

