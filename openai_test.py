import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
key = os.getenv('OPENAI_API')
client = OpenAI(api_key=key)

message_list = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "A simple event is an event that has a specific time and duration."},
    {"role": "system",
     "content": "A floating event or a task is an event that has a duration, but has not been assigned to a time yet."},
    {"role": "system",
     "content": "A task is an event that has a specific deadline, has a required time to complete, and can be broken up into segments."},
    {"role": "system",
     "content": "Your mission is to identify whether the user's input is a simple event, a floating event, a task, or something else."},
    {"role": "system", "content": "If the user inputs a simple event, say S."},
    {"role": "system", "content": "If the user inputs a floating event or a task, ask them if it's interruptible."},
    {"role": "system",
     "content": "If the user replys no after asking them if it's interruptible, it's a floating event, say F, and do your mission from the start."},
    {"role": "system",
     "content": "If the user replys yes after asking them if it's interruptible, it's a task, say T, and reset."},
    {"role": "system", "content": "If the user inputs something else, like not a schedule, say N."}
]
print("How can I help you?")

if __name__ =="__main__":
    while True:
        sentence = input()
        message_list.append({"role": "user", "content": sentence})
        completion = client.chat.completions.create(
            model="gpt-4-0125-preview",
            messages=message_list
        )
        token = completion.choices[0].message.content
        if token == "S":
            next_sentence = "This is a simple event."
        elif token == "F":
            next_sentence = "This is a floating event."
        elif token == "T":
            next_sentence = "This is a task."
        elif token == "N":
            next_sentence = "I don't understand."
        else:
            next_sentence = token
        print(next_sentence)
