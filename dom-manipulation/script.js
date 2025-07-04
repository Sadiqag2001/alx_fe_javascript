let quotesArray = [];

// === Local Storage Key ===
const STORAGE_KEY = "dynamic_quotes";

// === Load from LocalStorage ===
function loadQuotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      quotesArray = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored quotes", e);
      quotesArray = [];
    }
  } else {
    // Default initial quotes
    quotesArray = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Concentrate the mind on the present moment.", category: "Mindfulness" },
      { text: "Success comes to those who are too busy to be looking for it.", category: "Success" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    ];
  }
}

// === Save to LocalStorage ===
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotesArray));
}

// === Populate Category Dropdown ===
function populateCategoryOptions() {
  const select = document.getElementById("categoryFilter");
  const categories = new Set(quotesArray.map(q => q.category));
  select.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// === Show Random Quote ===
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filtered = selectedCategory === "all" 
      ? quotesArray 
      : quotesArray.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}"</p><small>${quote.category}</small>`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// === Create Add Quote Form ===
function createAddQuoteForm() {
  const form = document.createElement('form');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.required = true;
  quoteInput.placeholder = 'Enter quote text';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.required = true;
  categoryInput.placeholder = 'Enter category';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add Quote';

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newQuote = {
      text: quoteInput.value.trim(),
      category: categoryInput.value.trim()
    };

    quotesArray.push(newQuote);
    quoteInput.value = "";
    categoryInput.value = "";

    saveQuotes();
    populateCategoryOptions();
    showRandomQuote();
  });

  document.querySelector('h3').insertAdjacentElement('afterend', form);
}

// === Export Quotes as JSON ===
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotesArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes from JSON File ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        quotesArray.push(...imported);
        saveQuotes();
        populateCategoryOptions();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (e) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Initialization ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategoryOptions();
  createAddQuoteForm();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}"</p><small>${quote.category}</small>`;
  } else {
    showRandomQuote();
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
});
