const socket = io();

socket.on('initialProducts', (initialProducts) => {
  updateProductList(initialProducts);
});

socket.on('newProduct', (newProduct) => {
  addProductToList(newProduct);
});

socket.on('productsUpdated', (updatedProducts) => {
  updateProductList(updatedProducts);
});

function updateProductList(products) {
  const productList = document.getElementById('productList');
  productList.innerHTML = ''; // Limpiar la lista existente

  products.forEach((product, index) => {
    const li = document.createElement('li');
    li.textContent = product;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.dataset.index = index;
    deleteButton.addEventListener('click', () => {
      socket.emit('deleteProduct', index);
    });
    li.appendChild(deleteButton);
    productList.appendChild(li);
  });
}

function addProductToList(product) {
  const productList = document.getElementById('productList');
  const li = document.createElement('li');
  li.textContent = product;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.dataset.index = productList.childElementCount;
  deleteButton.addEventListener('click', () => {
    socket.emit('deleteProduct', deleteButton.dataset.index);
  });
  li.appendChild(deleteButton);
  productList.appendChild(li);
}
