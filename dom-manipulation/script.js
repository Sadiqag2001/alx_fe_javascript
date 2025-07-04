
// document.addEventListener("DOMContentLoaded", () => {

//   async function showRandomQuote() {
//     const apiUrl = "https://api.kanye.rest";
//     const quoteDisplay = document.getElementById("quoteDisplay");

//     try {

//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       quoteDisplay.innerText = data.content;

//     } catch (error) {
      
//       console.error("Error fetching quote:", error);
//     }
//   }

//   document.getElementById("newQuote").addEventListener("click", showRandomQuote);
// });


// Initial array of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
];

// Populate category dropdown
function updateCategoryOptions() {
  const select = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map(q => q.category));
  select.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").textContent = filteredQuotes[randomIndex].text;
}

// Add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  updateCategoryOptions();
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Event Listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial load
updateCategoryOptions();
