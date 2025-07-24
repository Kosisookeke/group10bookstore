// script.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  // Run only on book.html
  if (window.location.pathname.includes("book.html") && bookId) {
    try {
      const res = await fetch(`http://localhost:3000/api/book?id=${bookId}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      const book = data.data;

      // Populate page
      document.getElementById("book-title").textContent = book.title;
      document.getElementById("book-author").textContent = book.author;
      document.getElementById("book-genre").textContent = book.genre?.name || "N/A";
      document.getElementById("book-price").textContent = book.price.toFixed(2);
      document.getElementById("book-isbn").textContent = book.ISBN;
      document.getElementById("book-stock").textContent = book.stock;
      document.getElementById("book-seller").textContent = `${book.seller?.name || 'Unknown'} (${book.seller?.email || 'N/A'})`;
      document.getElementById("book-created").textContent = new Date(book.createdAt).toLocaleDateString();

    } catch (err) {
      alert("Error loading book: " + err.message);
    }

    // Add to cart (for now, alert only)
    document.getElementById("add-to-cart").addEventListener("click", () => {
      const qty = parseInt(document.getElementById("quantity").value);
      alert(`Added ${qty} to cart!`);
    });

    // Checkout (for now, alert only)
    document.getElementById("checkout-now").addEventListener("click", () => {
      alert("✅ Checkout complete!");
    });
  }
});


// ----- CART LOGIC -----
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(book) {
  let cart = getCart();
  const existingItem = cart.find((item) => item.id === book.id);
  if (existingItem) {
    existingItem.quantity += book.quantity;
  } else {
    cart.push(book);
  }
  saveCart(cart);
  renderCartSidebar(); // update display
}

function removeFromCart(bookId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== bookId);
  saveCart(cart);
  renderCartSidebar();
}

function updateQuantity(bookId, newQuantity) {
  let cart = getCart();
  const item = cart.find((item) => item.id === bookId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCartSidebar();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleCartBtn = document.getElementById("toggle-cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");

  toggleCartBtn?.addEventListener("click", () => {
    cartSidebar.style.display = cartSidebar.style.display === "none" ? "block" : "none";
    renderCartSidebar(); // load cart every time it's opened
  });
});


function renderCartSidebar() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const cart = getCart();
  cartItemsContainer.innerHTML = ""; // clear previous

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("mb-2");
    itemDiv.innerHTML = `
      <div><strong>${item.title}</strong></div>
      <div>Qty: 
        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="form-control-sm quantity-input" style="width: 60px;">
        <button class="btn btn-sm btn-danger ms-2 remove-item-btn" data-id="${item.id}">x</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = total.toFixed(2);

  // Quantity change listeners
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const bookId = input.dataset.id;
      const newQty = parseInt(input.value);
      if (newQty > 0) updateQuantity(bookId, newQty);
    });
  });

  // Remove button listeners
  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookId = btn.dataset.id;
      removeFromCart(bookId);
    });
  });
}


document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get("id");

      // For now mock data - later we'll fetch real book info by ID
      const mockBook = {
        id: bookId,
        title: "Mock Book",
        price: 19.99,
        quantity: 1,
      };

      addToCart(mockBook);
      alert("Book added to cart!");
    });
  }
});
