const STORAGE_KEY_QUOTES = "dynamic_quotes";
const STORAGE_KEY_CATEGORY = "selected_category";

let quotesArray = [];

// === Load existing quotes or use default ===
function loadQuotes() {
  const stored = localStorage.getItem(STORAGE_KEY_QUOTES);
  if (stored) {
    quotesArray = JSON.parse(stored);
  } else {
    quotesArray = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Concentrate the mind on the present moment.", category: "Mindfulness" },
      { text: "Success comes to those who are too busy to be looking for it.", category: "Success" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    ];
    saveQuotes();
  }
}

// === Save quotes to localStorage ===
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotesArray));
}

// === Save selected category ===
function saveSelectedCategory(category) {
  localStorage.setItem(STORAGE_KEY_CATEGORY, category);
}

// === Load saved category ===
function loadSelectedCategory() {
  return localStorage.getItem(STORAGE_KEY_CATEGORY) || "all";
}

// === Populate categories from quotes ===
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const selectedCategory = loadSelectedCategory();

  const categories = new Set(quotesArray.map(q => q.category));
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    select.appendChild(option);
  });
}

// === Show a random quote from the selected category ===
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  let filtered = category === "all" ? quotesArray : quotesArray.filter(q => q.category === category);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes found in this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>${randomQuote.category}</small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// === Filter quotes (on category change) ===
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selected);
  showRandomQuote();
}

// === Create the form for adding quotes ===
function createAddQuoteForm() {
  const form = document.createElement("form");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newQuote = {
      text: quoteInput.value.trim(),
      category: categoryInput.value.trim()
    };

    if (!newQuote.text || !newQuote.category) return;

    quotesArray.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();

    quoteInput.value = "";
    categoryInput.value = "";
  });

  document.querySelector("h3")?.insertAdjacentElement("afterend", form);
}

// === Fetch quotes from server and merge ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES)) || [];

    let newQuotes = [];

    serverQuotes.forEach(serverQuote => {
      const match = localQuotes.find(local =>
        local.text === serverQuote.text && local.category === serverQuote.category
      );
      if (!match) {
        newQuotes.push(serverQuote);
      }
    });

    if (newQuotes.length > 0) {
      quotesArray.push(...newQuotes);
      saveQuotes();
      populateCategories();
      document.getElementById('syncStatus').textContent =
        `🔄 ${newQuotes.length} new quote(s) synced from server.`;
    } else {
      document.getElementById('syncStatus').textContent = `✅ Quotes are up to date with server.`;
    }
  } catch (error) {
    console.error("❌ Failed to fetch from server:", error);
    document.getElementById('syncStatus').textContent = `❌ Server fetch failed.`;
  }
}

// === Post local quotes to server ===
async function postQuotesToServer() {
  try {
    const localQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES)) || [];

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(localQuotes)
    });

    if (response.ok) {
      console.log("✅ Quotes successfully sent to server.");
    } else {
      console.error("❌ Failed to send quotes to server:", response.status);
    }
  } catch (error) {
    console.error("❌ Error posting quotes:", error);
  }
}

// === Initialize on DOM ready ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <p>"${quote.text}"</p>
      <small>${quote.category}</small>
    `;
  } else {
    showRandomQuote();
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Two-way sync
  fetchQuotesFromServer();     // Pull from server
  postQuotesToServer();        // Push to server
  setInterval(fetchQuotesFromServer, 30000); // Sync every 30 seconds
});
