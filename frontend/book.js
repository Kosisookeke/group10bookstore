    const API_BASE = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const logoutBtn = document.getElementById('logout-btn');

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

    const bookDetailEl = document.getElementById('book-detail');
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    async function loadBook(id) {
      
      try {
        const res = await fetch(`${API_BASE}/book?id=${id}`);
        const data = await res.json();
        
        if (!data.success) {
          bookDetailEl.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
          return;
        }

        const book = data.data;
        displayBook(book);

        HTML = `
          <div class="card shadow-sm p-4">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre?.name || 'N/A'}</p>
            <p><stbookDetailEl.innerrong>Price:</strong> $${book.price.toFixed(2)}</p>
            <p><strong>Stock:</strong> ${book.stock}</p>
            <div class="d-flex gap-2 align-items-center mt-3">
              <input type="number" id="quantity" class="form-control w-auto" min="1" max="${book.stock}" value="1"/>
              <button class="btn btn-primary" onclick="addToCart('${book._id}', ${book.price})">Add to Cart</button>
            </div>
          </div>
        `;
      } catch (err) {
        console.error(err);
        bookDetailEl.innerHTML = `<div class="alert alert-danger">Error loading book.</div>`;
      }
      
    }

    function displayBook(book) {
  const bookDetailEl = document.getElementById('book-detail');
  bookDetailEl.innerHTML = `
    <div class="card shadow-sm p-4">
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre?.name || 'N/A'}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <p><strong>Stock:</strong> ${book.stock}</p>
      <div class="d-flex gap-2 align-items-center mt-3">
        <input type="number" id="quantity" class="form-control w-auto" min="1" max="${book.stock}" value="1"/>
        <button class="btn btn-primary" onclick="addToCart('${book.id}', ${book.price})">Add to Cart</button>
      </div>
    </div>
  `;
  

}

    async function addToCart(bookId, price) {
      const qty = parseInt(document.getElementById('quantity').value);
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      if (qty <= 0) {
        alert('Quantity must be at least 1');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({bookId, quantity: qty })
        });
        const data = await res.json();

        if (res.ok) {
          alert('Book added to cart');
        } else {
          alert(data.message || 'Failed to add to cart');
        }
      } catch (err) {
        console.error(err);
        alert('Error adding to cart');
      }
    }

    loadBook(bookId);

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

    if (!res.ok) return alert(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    location.reload();

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

// Handle search
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );

  displayBooks(filtered);
}

//checkout cart
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
      alert('Checkout complete!\n\n' + data.message + '\nTotal: $' + data.totalAmount);
      loadCart(); // Refresh cart
    } else {
      alert(data.error || 'Checkout failed');
    }
  } catch (err) {
    alert('Error during checkout');
    console.error(err);
  }
}