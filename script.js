// import hljs from 'highlight.js';

let messages = []
let message_text = ""

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
      fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          const outputText = data.choices[0]['message']['content'].trim();
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
});