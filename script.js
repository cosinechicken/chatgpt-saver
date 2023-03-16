let messages = [];
let message_text = "";
let apiKey = getCookie("apiKey");

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
          if (data.choices[0]['finish_reason'] === 'length') {
            updateOutput('ChatGPT did not finish outputting, due to the max_tokens parameter or token limit.', "error");
          } else if (data.choices[0]['finish_reason'] === 'content_filter') {
            updateOutput('ChatGPT omitted content due to a flag from its content filters.', "error");
          }
          scrollToBottom();
        })
        .catch((error) => {
          console.error('Error:', error);
          updateOutput('Error: There was an error generating the output. You may have to refresh the site or use a different API key.', "error");
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
    setCookie("apiKey", apiKey, 7);
    modal.style.display = "none";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log("Cookie " + cname + " set. ");
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        console.log("Cookie " + cname + " retrieved. ");
        return c.substring(name.length, c.length);
      }
    }
    console.log("no cookie found");
    return "";
  }