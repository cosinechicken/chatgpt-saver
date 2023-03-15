let messages = []
let message_text = ""

function handleKeyDown(event) {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    const inputText = document.getElementById('input-text').value.trim();
    if (inputText.length > 0) {
      updateOutput('You: ' + inputText);
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
          updateOutput('ChatGPT: ' + outputText);
          messages.push({"role": "assistant", "content": outputText});
          scrollToBottom();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
}

function updateOutput(text) {
    const outputPane = document.getElementById('output-pane');
    const messageElement = document.createElement('div');
    messageElement.classList.add('output-message');
    if (text.startsWith('You:')) {
      messageElement.classList.add('user-message');
    } else if (text.startsWith('ChatGPT:')) {
      messageElement.classList.add('assistant-message');
    }
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);

    messageElement.innerHTML = html;
    outputPane.appendChild(messageElement);

    scrollToBottom();
}

function scrollToBottom() {
  const outputPane = document.getElementById('output-pane');
  outputPane.scrollTop = outputPane.scrollHeight;
}