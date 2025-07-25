    const API_BASE = 'http://localhost:3000/api';
    const bookListEl = document.getElementById('book-list');
    const categoryFiltersEl = document.getElementById('category-filters');
    

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    


    if (token) {
  document.getElementById('auth-buttons').classList.add('d-none');
  document.getElementById('logout-section').classList.remove('d-none');
  document.getElementById('navbar-username').textContent = `Hi, ${user.username}`;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

    // Initialize
    fetchBooks();
    fetchCategories();

    // Cart functionality
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsEl = document.getElementById('cart-items');

    cartBtn.addEventListener('click', () => {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('open');
      loadCart();
    });

    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
    });

    cartOverlay.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
    });

    async function loadCart() {
      if (!token) {
        cartItemsEl.innerHTML = `<div class="alert alert-warning">Please login to view your cart.</div>`;
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success || !data.data.length) {
          cartItemsEl.innerHTML = `<p>Your cart is empty.</p>`;
          return;
        }
        cartItemsEl.innerHTML = data.data.map(item => `
          <div class="mb-3 border-bottom pb-2">
            <strong>${item.book.title}</strong><br>
            Quantity: ${item.quantity}<br>
            Price: $${item.book.price.toFixed(2)}
          </div>
        `).join('');
      } catch (err) {
        cartItemsEl.innerHTML = `<div class="alert alert-danger">Error loading cart.</div>`;
      }
    }

    // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log('login response:', data);

    if (!res.ok) return alert(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === 'seller') {
      window.location.href = 'dashboard.html';
    } else {
      location.reload(); // buyer reloads index page
    }

    } catch (err) {
    alert('Login error');
  }
}


async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    location.reload();

  } catch (err) {
    alert('Registration error');
  }
}

// Function to filter books by category
const categoryListEl = document.getElementById('category-list');
let allBooks = [];

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    categoryListEl.innerHTML = '<li><a class="dropdown-item" href="#" onclick="filterByCategory(null)">All</a></li>';
    data.categories.forEach(category => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="#" onclick="filterByCategory('${category._id}')">${category.name}</a>`;
      categoryListEl.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}


function displayBooks(books) {
  const bookListEl = document.getElementById('book-list');
  bookListEl.innerHTML = '';

  if (!books || books.length === 0) {
    bookListEl.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
          <p class="card-text">Price: $${book.price.toFixed(2)}</p>
          <p class="card-text text-muted">Genre: ${book.genre?.name || 'N/A'}</p>
          <a href="book.html?id=${book._id}" class="btn btn-sm btn-primary">View</a>
        </div>
      </div>
    `;
    bookListEl.appendChild(col);
  });
}

async function fetchBooks() {
  try {
    const res = await fetch(`${API_BASE}/books`);
    const data = await res.json();
    allBooks = data.data;
    displayBooks(allBooks);
  } catch (err) {
    console.error('Error fetching books:', err);
  }
}

function filterByCategory(categoryId) {
  const filtered = categoryId
    ? allBooks.filter(book => book.genre._id === categoryId)
    : allBooks;

  displayBooks(filtered);
}

//Handle search input
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );

  displayBooks(filtered);
}

  // Checkout cart
  async function checkoutCart() {
  if (!token) {
    alert('Please login to checkout.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cart/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert(' Checkout complete!\n\n' + data.message + '\nTotal: $' + data.totalAmount);
      loadCart(); // Refresh cart
    } else {
      alert(data.error || 'Checkout failed');
    }
  } catch (err) {
    alert('Error during checkout');
    console.error(err);
  }
}