const fileInput = document.getElementById('file-input');
const submitButton = document.getElementById('submit-button');
const output = document.getElementById('output');
const saveButton = document.getElementById('save-button');
const savePdfButton = document.getElementById('save-pdf-button');
const termsDefs = document.getElementById('terms-defs');
const fileLabel = document.querySelector('.custom-file-label');
const message = document.getElementById('warning-message')

fileInput.addEventListener('change', function() {
    const fileName = fileInput.files[0].name;
    fileLabel.innerText = fileName;
});


/*submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to extract terms and definitions from.");
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
//https://auto-text.onrender.com
    fetch('http://localhost:5000/terms', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const terms = data.terms;
        const definitions = data.definitions;
        for (var i = 0; i < terms.length; i++) {
            const term = terms[i];
            const definition = definitions[i];
            const row = document.createElement('tr');
            const termColumn = document.createElement('td');
            termColumn.innerText = term;
            const definitionColumn = document.createElement('td');
            definitionColumn.innerText = definition;
            row.appendChild(termColumn);
            row.appendChild(definitionColumn);
            termsDefs.appendChild(row);
        }
        output.classList.remove("d-none");
        savePdfButton.classList.remove("d-none");
        message.innerText = "Thank you for using our service! Our algorithim may not be 100% accurate all the time, be sure to double check terms and definitons"
        message.classList.remove("d-none")
    });
});*/
submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to extract terms and definitions from.");
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://auto-text.onrender.com/terms', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const terms = data.terms;
        const definitions = data.definitions;
        const images = data.images;
        for (var i = 0; i < terms.length; i++) {
            const term = terms[i];
            const definition = definitions[i];
            const image = images[i];
            const row = document.createElement('tr');
            const termColumn = document.createElement('td');
            termColumn.innerText = term;
            const definitionColumn = document.createElement('td');
            definitionColumn.innerText = definition;
            const imageColumn = document.createElement('td');
            if (image) {
                const img = document.createElement('img');
                img.src = 'data:image/png;base64,' + image;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                imageColumn.appendChild(img);
            }
            row.appendChild(termColumn);
            row.appendChild(definitionColumn);
            row.appendChild(imageColumn);
            termsDefs.appendChild(row);
        }
        output.classList.remove("d-none");
        savePdfButton.classList.remove("d-none");
        message.innerText = "Thank you for using our service! Our algorithm may not be 100% accurate all the time, be sure to double check terms and definitions"
        message.classList.remove("d-none")
    });
});


saveButton.addEventListener('click', function(event) {
    event.preventDefault();
    const terms = document.querySelectorAll("#terms-defs tr td:first-child");
    const definitions = document.querySelectorAll("#terms-defs tr td:last-child");
    const termsText = Array.from(terms).map(td => td.innerText).join("\n");
    const definitionsText = Array.from(definitions).map(td => td.innerText).join("\n");

    const json = { terms: termsText, definitions: definitionsText };
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));

    const link = document.createElement('a');
    link.setAttribute("href", data);
    link.setAttribute("download", "terms-defs.json");
    link.click();
});

/*savePdfButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Access the terms and definitions
    const terms = document.querySelectorAll("#terms-defs tr td:first-child");
    const definitions = document.querySelectorAll("#terms-defs tr td:last-child");
    const termsText = Array.from(terms).map(td => td.innerText);
    const definitionsText = Array.from(definitions).map(td => td.innerText);

    // Prepare the data to send to the server
    const data = {
        terms: termsText,
        definitions: definitionsText
    };

    // Make the fetch call to the server
    fetch('https://auto-libs.onrender.com/terms/pdf', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.blob())
    .then(blob => {
        // Create a URL for the file
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = "terms-defs.pdf";

        // Append the link element to the body and click it
        document.body.appendChild(link);
        link.click();

        // Remove the link element from the body
        document.body.removeChild(link);
    });
});*/
// Get the button element

// Add a click event listener to the button
savePdfButton.addEventListener('click', function(event) {
    event.preventDefault();
  
    // Access the terms, definitions, and images
    const rows = document.querySelectorAll('#terms-defs tr');
    const terms = [];
    const definitions = [];
    const images = [];
    rows.forEach((row) => {
      const term = row.querySelector('td:first-child');
      const definition = row.querySelector('td:nth-child(2)');
      const image = row.querySelector('td:nth-child(3) img');
      if (term && definition) {
        terms.push(term.innerText);
        definitions.push(definition.innerText);
        if (image) {
          images.push(image.src);
        }
      }
    });
  
    // Create the HTML content
    let content = '<h1 style="text-align: center; margin-bottom: 20px;">Terms and Definitions</h1>';
    content += '<table style="width: 100%; border-collapse: collapse;">';
    content += '<thead style="background-color: #ddd;"><tr><th style="padding: 10px; text-align: left; border: 1px solid #ccc;">Term</th><th style="padding: 10px; text-align: left; border: 1px solid #ccc;">Definition</th><th style="padding: 10px; text-align: left; border: 1px solid #ccc;">Image</th></tr></thead>';
    content += '<tbody>';
    for (let i = 0; i < terms.length; i++) {
      content += '<tr>';
      content += `<td style="padding: 10px; border: 1px solid #ccc;">${terms[i]}</td>`;
      content += `<td style="padding: 10px; border: 1px solid #ccc;">${definitions[i]}</td>`;
      content += `<td style="padding: 10px; border: 1px solid #ccc;">${images[i] ? `<img src="${images[i]}" style="width: 100%">` : ''}</td>`;
      content += '</tr>';
    }
    content += '</tbody>';
    content += '</table>';
  
    // Create the PDF document
    const element = document.createElement('div');
    element.innerHTML = content;
    const opt = {
      margin: 0.5,
      filename: 'terms-defs.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  });
  












const saveWordButton = document.getElementById("save-word-button");
saveWordButton.addEventListener('click', function(event) {
    event.preventDefault();
    const terms = Array.from(document.querySelectorAll("#terms-defs tr td:first-child")).map(td => td.innerText);
    const definitions = Array.from(document.querySelectorAll("#terms-defs tr td:last-child")).map(td => td.innerText);

    fetch('https://auto-text-libs.andrewpaige1.repl.co//generate-word-doc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ terms, definitions })
    })
    .then(res => res.blob())
    .then(blob => {
        saveAs(blob, "terms-defs.docx");
    });
});




const saveTxtButton = document.getElementById("save-txt-button");
saveTxtButton.addEventListener('click', function(event) {
    event.preventDefault();
    const terms = document.querySelectorAll("#terms-defs tr td:first-child");
    const definitions = document.querySelectorAll("#terms-defs tr td:last-child");
    let text = "";
    for (let i = 0; i < terms.length; i++) {
        text += terms[i].innerText + " - " + definitions[i].innerText + "\n";
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "terms-defs.txt");
});
