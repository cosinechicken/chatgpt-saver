import markdown

input_file = 'chatgpt_response.txt'
output_file = 'output.html'

with open(input_file, 'r') as f:
    text = f.read()

# Replace triple backticks with code block syntax for markdown
text = text.replace('```', '\n```')

html = markdown.markdown(text, extensions=['fenced_code'])

with open(output_file, 'w') as f:
    f.write(f'''
        <!DOCTYPE html>
        <html>
            <head>
                <title>Converted Text</title>
            </head>
            <body>
                <div>
                    {html}
                </div>
            </body>
        </html>
    ''')