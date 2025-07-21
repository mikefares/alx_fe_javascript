let quotes = []

const defaultQuotes = [
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
const categorySelect = document.getElementById('categoryFilter');

window.onload = () => {
    quotes = [...defaultQuotes];

    loadFromLocal();
    createAddQuoteForm();
    showNewQuote.addEventListener('click',showRandomQuote);
    exportBtn.addEventListener("click", exportQuotes);
    populateCategories();
    
    const savedCategory = localStorage.getItem("lastSelectedCategory");
    if (savedCategory && [...categorySelect.options].some(option => option.value === savedCategory)) {
        categorySelect.value = savedCategory;
    }

    filterQuotes();
    syncQuotes();
}

function loadFromLocal(){
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key === "lastSelectedCategory") continue;
        try {
            const storedQuote = JSON.parse(localStorage.getItem(key));
        if (storedQuote && storedQuote.text && storedQuote.category) {
            if (!quotes.some(q => q.text === storedQuote.text && q.category === storedQuote.category)) {
                    quotes.push(storedQuote);
                }
        }
        } catch (e) {
            console.warn(`Invalid entry for key ${key}:`, e);
        }
    };
};

function showRandomQuote() {
    const filteredQuotes = filterQuotes(true); // Get quotes without displaying

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerText = "No quotes found for the selected category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `${quote.text} - ${quote.category}`;
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

            let found = false;
            for (let i = 0; i < categorySelect.options.length; i++) {
                if (categorySelect.options[i].value.toLowerCase() === newCategory.toLowerCase()) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                const option = document.createElement('option');
                option.value = newCategory;
                option.textContent = newCategory;
                categorySelect.appendChild(option);
            }

            quoteInput.value = '';
            categoryInput.value = '';
            alert('Quote added successfully!');
            sendQuotesToServer(quoteObject);
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

function exportQuotes(){
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    
    let importedCount = 0; 

    importedQuotes.forEach((quote) => {
      if (quote.text && quote.category) {
        if (!quotes.some(q => q.text === quote.text && q.category === quote.category)) {
              const id = Date.now().toString();
              localStorage.setItem(id, JSON.stringify(quote));
              quotes.push(quote);
              importedCount++;
            }
      }
    });

    alert(`${importedCount} quote(s) imported successfully!`);
  };

  fileReader.readAsText(event.target.files[0]);
}

function populateCategories(){
    let categories = quotes.map(q => q.category);

    categories = categories.filter((cat, index, self) => {
        return self.indexOf(cat) === index;
    });
    categories.sort();

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuotes(returnOnly = false){
    const selectedCategory = categorySelect.value;

    localStorage.setItem("lastSelectedCategory", selectedCategory);

    let filteredQuotes;
    if (selectedCategory === "all"){
        filteredQuotes = quotes;
    }
    else{
        filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (returnOnly) {
        return filteredQuotes;
    }

    quoteDisplay.innerHTML = "";
}

async function fetchQuotesFromServer(){
    try{    
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();

        const serverQuotes = data.slice(0, 10).map(post => ({
            text: post.title,
            category: post.body.split(" ")[0]
        }));

        for (const sQuote of serverQuotes){
        // serverQuotes.forEach(sQuote => {
            console.log(sQuote);
            const existingQuote = quotes.findIndex(q => q.text === sQuote.text);

            if (existingQuote !== -1){
                quotes[existingQuote] = sQuote;               
            }
            else {
                quotes.push(sQuote);
                const id = Date.now().toString();;
                localStorage.setItem(id, JSON.stringify(sQuote));
            }
        };
    }
    catch{
        console.error("Failed to fetch quotes from server")
    }
}

async function syncQuotes(){
    await fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 10000);
    alert("Quotes synced with server!")
}

async function sendQuotesToServer(quote){
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quote.text,
                category: quote.category
            })
        })

        const result = await response.json();
        console.log(result);
    }
    catch{
        console.error("Failed to push quotes to server")
    }
}
