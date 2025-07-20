let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
    { text: "The mind is everything. What you think you become.", category: "Mindfulness" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Business" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const showNewQuote = document.getElementById("newQuote");
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');

function loadFromLocal(){
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const storedQuote = JSON.parse(localStorage.getItem(key));
        if (storedQuote && storedQuote.text && storedQuote.category) {
            quotes.push(storedQuote);
        }
        } catch (e) {
        // Ignore non-quote entries
        }
    };
};

function showRandomQuote(){
    if (quotes.length === 0){
        quoteDisplay.innerText = "There are no quotes available";
        return;
    }

    const randomNumber = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomNumber];
    console.log(quote)
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
            const quoteObject = {text: newQuote, category: newCategory};
            const id = Date.now().toString();
            localStorage.setItem(id, JSON.stringify(quoteObject));
            quotes.push(quoteObject);
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

exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
})

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    
    let importedCount = 0; 

    importedQuotes.forEach((quote) => {
      if (quote.text && quote.category) {
        const id = Date.now().toString() + Math.random().toString(16).slice(2); 
        localStorage.setItem(id, JSON.stringify(quote)); 
        quotes.push(quote); 
        importedCount++;
      }
    });

    alert(`${importedCount} quote(s) imported successfully!`);
  };

  fileReader.readAsText(event.target.files[0]);
}

window.onload = () => {
    loadFromLocal();
    createAddQuoteForm();
}

