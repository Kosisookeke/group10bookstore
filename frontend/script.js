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
