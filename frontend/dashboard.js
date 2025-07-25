// dashboard.js

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user || user.role !== 'seller') {
  // Not authenticated or not a seller
  alert('Access denied. Only sellers can access this page.');
  window.location.href = 'index.html';
}

const bookContainer = document.getElementById('bookManagerContainer');
const categoryContainer = document.getElementById('categoryManagerContainer');

const api = 'http://localhost:3000/api'; // Change if needed

// Set global headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
async function loadCategories() {
  const res = await fetch(`${api}/categories`, { headers });
  const data = await res.json();
  const select = document.querySelector('select[name="genre"]');
  select.innerHTML = data.categories.map(cat =>
    `<option value="${cat._id}">${cat.name}</option>`
  ).join('');
}

async function loadBooks() {
  const res = await fetch(`${api}/books`, { headers });
  const data = await res.json();

  const books = data.data.filter(book => book.seller._id === user.id);

  const container = document.getElementById('bookList');
  container.innerHTML = books.map(book => `
    <div class="card mb-2">
      <div class="card-body">
        <h5>${book.title} (${book.stock} in stock)</h5>
        <p>Author: ${book.author} | Price: $${book.price}</p>
        <small>ISBN: ${book.ISBN} | Genre: ${book.genre.name}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-warning" onclick="editBook('${book._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

//add book form submission
document.getElementById('addBookForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const formData = Object.fromEntries(new FormData(form));
  formData.price = parseFloat(formData.price);
  formData.stock = parseInt(formData.stock);

  const res = await fetch(`${api}/books`, {
    method: 'POST',
    headers,
    body: JSON.stringify(formData)
  });

  const data = await res.json();
  if (data.success) {
    alert('Book added successfully!');
    form.reset();
    loadBooks();
  } else {
    alert(data.message || 'Failed to add book.');
  }
});

//delete and edit book functions
async function deleteBook(id) {
  if (!confirm('Delete this book?')) return;

  const res = await fetch(`${api}/books?id=${id}`, {
    method: 'DELETE',
    headers
  });
  const data = await res.json();
  if (data.success) {
    alert('Deleted');
    loadBooks();
  } else {
    alert(data.message);
  }
}

async function editBook(id) {
  const title = prompt('New title:');
  const stock = prompt('New stock:');
  if (!title || !stock) return;

  const res = await fetch(`${api}/books?id=${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ title, stock: parseInt(stock) })
  });

  const data = await res.json();
  if (data.success) {
    alert('Updated!');
    loadBooks();
  } else {
    alert(data.message);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadBooks();
});

//load and display categories
async function loadCategoriesList() {
  const res = await fetch(`${api}/categories`, { headers });
  const data = await res.json();

  const container = document.getElementById('categoryList');
  container.innerHTML = data.categories.map(cat => `
    <div class="card mb-2">
      <div class="card-body">
        <h5>${cat.name}</h5>
        <p>${cat.description || 'No description'}</p>
        <div>
          <button class="btn btn-sm btn-warning" onclick="editCategory('${cat._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${cat._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}
//add category form submission
document.getElementById('addCategoryForm').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));

  const res = await fetch(`${api}/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(formData)
  });

  const data = await res.json();
  if (res.ok) {
    alert('Category added!');
    e.target.reset();
    loadCategoriesList();
    loadCategories(); // to update dropdown in book form
  } else {
    alert(data.message || 'Failed to create category');
  }
});

//delete and edit category functions
async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  const res = await fetch(`${api}/categories?id=${id}`, {
    method: 'DELETE',
    headers
  });

  const data = await res.json();
  if (res.ok) {
    alert('Deleted!');
    loadCategoriesList();
    loadCategories();
  } else {
    alert(data.message);
  }
}

async function editCategory(id) {
  const name = prompt('New name:');
  const description = prompt('New description:');

  if (!name) return;

  const res = await fetch(`${api}/categories?id=${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name, description })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Updated!');
    loadCategoriesList();
    loadCategories();
  } else {
    alert(data.message);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadBooks();
  loadCategoriesList();
});
