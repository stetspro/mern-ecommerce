const socket = io();

const addProduct = (e) => {
    let title = document.getElementById("title").value;
    let code = document.getElementById("code").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;
    let description = document.getElementById("description").value;
    let thumbnail = document.getElementById("thumbnail").value;
    
    let toys = document.getElementById("category-plushies").checked;
    let decoration = document.getElementById("category-homedecor").checked;
    let accesories = document.getElementById("category-accesories").checked;

    const category = toys && 'toys' || decoration && 'decoration' || accesories && 'accesories';

    const product = { title, code, price, stock, description, thumbnail, category };
    socket.emit('onaddproduct', product);

    cleanForm();
    
    return false;
}

const cleanForm = () => {
    document.getElementById("title").value = '';
    document.getElementById("code").value = '';
    document.getElementById("price").value = '';
    document.getElementById("stock").value = '';
    document.getElementById("description").value = '';
    document.getElementById("thumbnail").value = '';
    document.getElementById("category-plushies").checked = false;
    document.getElementById("category-homedecor").checked = false;
    document.getElementById("category-accesories").checked = false;
}

const deleteProduct = (pid) => {
    socket.emit('ondeleteproduct', pid);
    return false;
}

const createProductHtml = (product) => {
    const { title, code, price, stock, description, thumbnail, category, _id } = product;

    return `
    <div class="group relative">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <img src="${thumbnail}" alt="${title}" class="h-full w-full object-cover object-center lg:h-full lg:w-full">
        </div>
        <div class="mt-4 flex justify-between">
            <div>
                <h3 class="text-sm text-gray-700">
                    <a href="#">
                        <span aria-hidden="true" class="absolute inset-0"></span>
                        ${title}
                    </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">${description}</p>
            </div>
            <p class="text-sm font-medium text-gray-900">$${price}</p>
      
            <button style="z-index: 999" type="button" onclick="return deleteProduct('${_id}'); return false;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-1 stroke-red-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    </div>
    `
}

const updateProductsHtml = (products) => {
    const finalProducts = products.map(p => createProductHtml(p)).join(" ");
    document.getElementById('productsContainer').innerHTML = finalProducts;
}

socket.on('products', (products) => updateProductsHtml(products.payload));