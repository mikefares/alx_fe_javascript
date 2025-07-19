let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
    { text: "The mind is everything. What you think you become.", category: "Mindfulness" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Business" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const showNewQuote = document.getElementById("newQuote");

function showRandomQuote(){
    if (quotes.length === 0){
        quoteDisplay.innerText = "There are no quotes available";
        return;
    }

    const randomNumber = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomNumber];
    quoteDisplay.innerText = `${quote.text} - ${quote.category}`
}

function createAddQuoteForm(){
    const form = document.createElement('form');
    form.id = "quoteForm";

    const quoteInput = document.createElement('input');
    quoteInput.required = true;
    quoteInput.placeholder = "Enter quote";

    const categoryInput = document.createElement('Input');
    categoryInput.required = true;
    categoryInput.placeholder = "Enter category";

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Add new quote";
    submitBtn.type = "submit";

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const newQuote = quoteInput.value.trim();
        const newCategory = categoryInput.value.trim();

        if (newQuote && newCategory) {
        quotes.push({ text: newQuote, category: newCategory });
        quoteInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
        }
    });

    form.appendChild(quoteInput);
    form.appendChild(categoryInput);
    form.appendChild(submitBtn);
    document.body.appendChild(form);
}

showNewQuote.addEventListener('click',showRandomQuote)