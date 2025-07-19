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
    const container = document.getElementById('quoteFormContainer');

    container.innerHTML = `
        <div style="margin-top: 1rem;">
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
        </div>
    `;

    const addQuoteBtn = document.getElementById('addQuoteBtn');
    addQuoteBtn.addEventListener('click', addQuote);

}

function addQuote(){
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const newQuote = quoteInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newQuote && newCategory) {
        quotes.push({ text: newQuote, category: newCategory });
        quoteInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
    }
    else{
        alert("Please fill out both fields");
        }
}

showNewQuote.addEventListener('click',showRandomQuote);
window.onload = createAddQuoteForm;