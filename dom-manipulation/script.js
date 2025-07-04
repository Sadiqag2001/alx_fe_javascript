let quotesArray = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" },
  { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
];
function showRandomQuote(){
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    const quote = quotesArray[randomIndex];

    const quoteDiv = document.getElementById('quoteDisplay');
    quoteDiv.innerHTML = `<p>'${quote.text}'</p>
                        <small>${quote.category}</small>`

}

function createAddQuoteForm(){
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
    submitBtn.style.marginTop = '15px';

    quoteInput.classList.add('custom-placeholder');
    categoryInput.classList.add('custom-placeholder');


    form.appendChild(quoteInput);
    form.appendChild(categoryInput);
    form.appendChild(submitBtn);

    form.addEventListener('submit', function(event){
        console.log(event);
        event.preventDefault();

        const newQuote = {
            text: quoteInput.value.trim(),
            category: categoryInput.value.trim()
        };

            quotesArray.push(newQuote);

            quoteInput.value = "";
            categoryInput.value = "";

            showRandomQuote();
    });

    document.body.appendChild(form);
}

document.addEventListener("DOMContentLoaded", function () {
 showRandomQuote();
 document.getElementById('newQuote').addEventListener('click', showRandomQuote);
 createAddQuoteForm();
});