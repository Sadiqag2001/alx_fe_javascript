// Initial set of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" },
  { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
];

// Populate category dropdown
function populateCategoryOptions() {
  const categories = new Set();
  quotes.forEach(q => categories.add(q.category));

  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="all">All</option>`; // Reset
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").textContent = `"${filteredQuotes[randomIndex].text}"`;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  populateCategoryOptions(); // Refresh dropdown
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added!");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);

// Initialize
populateCategoryOptions();
