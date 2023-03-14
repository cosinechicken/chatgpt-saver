import openai
import os

# First, you need to set up the OpenAI API key and model ID
openai.api_key = [insert openai api key here]
model_id = "gpt-3.5-turbo-0301"

# Define a function that takes a prompt as input and returns ChatGPT's response
def ChatGPT_conversation(conversation):
    response = openai.ChatCompletion.create(
        model=model_id,
        messages=conversation
    )
    # api_usage = response['usage']
    # print('Total token consumed: {0}'.format(api_usage['total_tokens']))
    # stop means complete
    # print(response['choices'][0].finish_reason)
    # print(response['choices'][0].index)
    conversation.append({'role': response.choices[0].message.role, 'content': response.choices[0].message.content})
    return conversation

# Define a function that saves a string to a text file
def save_to_file(conversation, file_path):
    with open(file_path, 'w') as file:
        text = ""
        for interaction in conversation:
            text += ((interaction['role'] + ": " + interaction['content']).strip() + "\n\n")
        file.write(text)

conversation = []
conversation.append({'role': 'system', 'content': 'How may I help you?'})
conversation = ChatGPT_conversation(conversation)
print('{0}: {1}\n'.format(conversation[-1]['role'].strip(), conversation[-1]['content'].strip()))

while True:
    prompt = input('User: ')
    print()
    conversation.append({'role': 'user', 'content': prompt})
    conversation = ChatGPT_conversation(conversation)
    print('{0}: {1}\n'.format(conversation[-1]['role'].strip(), conversation[-1]['content'].strip()))
    save_to_file(conversation, "chatgpt_response.txt")