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
    const container = document.createElement('div');
    container.innerHTML = `<div id="formWrapper" style="margin-top: 1rem;"></div>`;

    const formWrapper = container.querySelector('#formWrapper');
    
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.id = "addQuoteBtn";
    addButton.textContent = "Add Quote";

    addButton.addEventListener("click", () => {
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
            };
    });
    formWrapper.appendChild(quoteInput);
    formWrapper.appendChild(categoryInput);
    formWrapper.appendChild(addButton);
    document.body.appendChild(container);
}


showNewQuote.addEventListener('click',showRandomQuote);
window.onload = createAddQuoteForm;