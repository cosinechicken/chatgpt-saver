let messages = [];
let message_text = "";
let apiKey = "";

function handleKeyDown(event) {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    const inputText = document.getElementById('input-text').value.trim();
    if (inputText.length > 0) {
      updateOutput('You: ' + inputText, "text");
      document.getElementById('input-text').value = '';
      scrollToBottom();
      messages.push({"role": "user", "content": inputText})

      // Call ChatGPT API with inputText
      const data = {
        "model": "gpt-3.5-turbo",
        "messages": messages
      };
      authorization = ""
      fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          const outputText = data.choices[0]['message']['content'].trim();
          updateOutput('ChatGPT: ' + outputText, "text");
          messages.push({"role": "assistant", "content": outputText});
          scrollToBottom();
        })
        .catch((error) => {
          console.error('Error:', error);
          updateOutput('Error: ' + error, "error");
        });
    }
  }
}

function updateOutput(text, type) {
    const outputPane = document.getElementById('output-pane');
    const messageElement = document.createElement('div');
    messageElement.classList.add('output-message');
    if (type === "text") {
        if (text.startsWith('You:')) {
            messageElement.classList.add('user-message');
        } else if (text.startsWith('ChatGPT:')) {
            messageElement.classList.add('assistant-message');
        }
    } else {
        messageElement.classList.add('error-message');
    }
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);

    messageElement.innerHTML = html;
    outputPane.appendChild(messageElement);

    hljs.highlightAll();

    scrollToBottom();
}

function scrollToBottom() {
  const outputPane = document.getElementById('output-pane');
  outputPane.scrollTop = outputPane.scrollHeight;
}
const toggleBtn = document.getElementById('toggle-btn');
const body = document.querySelector('body');

toggleBtn.addEventListener('click', function() {
  body.classList.toggle('dark-mode'); // Toggle "dark-mode" class on body element
  if (body.classList.contains('dark-mode')) {
    toggleBtn.innerText = "Toggle Light Mode";
  } else {
    toggleBtn.innerText = "Toggle Dark Mode";
  }
});

// Get the modal
var modal = document.getElementById("api-code-modal");

// Get the button that opens the modal
var btn = document.getElementById("api-code-button");

// Get the submit button inside the modal
var submitBtn = document.getElementById("api-code-submit");

// Get the textarea inside the modal
var textarea = document.getElementById("api-code-textarea");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on submit button, close the modal
submitBtn.onclick = function() {
  submitAPICode();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var apicodetextarea = document.getElementById("api-code-textarea");
apicodetextarea.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        submitAPICode();
    }
});

function submitAPICode() {
    apiKey = apicodetextarea.value;
    modal.style.display = "none";
}