import os
import dotenv
from openai import OpenAI

client = OpenAI(api_key=dotenv.get_key(key_to_get="REACT_APP_OPENAI_API_KEY",dotenv_path="/Users/XiaojieZhou/UCLA/ECE209AS/AICalendar/aicalendar/.env"))

system_message_list = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "Your mission is to identify whether the user's input is a simple event, a floating event, a task, or something else"},
    {"role": "system", "content": "A simple event is an event that has a specific time."},
    {"role": "system", "content": "A floating event or a task is an event that may or may not have a duration, but has not been assigned to a time yet."},
    {"role": "system", "content": "If the user inputs a simple event, say S"},
    {"role": "system", "content": "If the user inputs a floating event or a task, say FT."},
    {"role": "system", "content": "If the user inputs something else, like not a schedule, say N."}
]

S_message_list = [
    {"role": "system", "content": "You need to make the output like: {'content': ''; 'time': ''; 'duration': ''}"},
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "Extract the Title, the Time, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."},
    {"role": "system", "content": "Like if the input is 'I have a class every monday and wednesday 2-4pm', output {'content': 'Class'; 'time': '2-4pm Every Monday and Wednesday'; 'duration': '2 hours'}'"}
]

FT_message_list = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "Ask them if it can be interrupted, and check the total duration of the event if not mentioned."}
]

FT_message_list1 = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "You need to make the output like: Title: ; Time: ; Date: ; Duration: ."},
    {"role": "system", "content": "Ask them if it can be interrupted, and check the total duration of the event if not mentioned."},
    {"role": "system", "content": "If the user replys no after asking them if it's interruptible, let Time be NA, and extract the Title, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."},
    {"role": "system", "content": "If the user replys yes after asking them if it's interruptible, let Time be NA, and extract the Title, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."}
]

message_list = system_message_list.copy()

print("How can I help you?")
while True:
    sentence = input()
    if sentence == 'q':
        break
    message_list = system_message_list.copy()
    message_list.append({"role": "user", "content": sentence})
    completion = client.chat.completions.create(
        model="gpt-4-0125-preview",
        messages = message_list
    )
    token = completion.choices[0].message.content
    if token == "S":
        message_list = S_message_list.copy()
        message_list.append({"role": "user", "content": sentence})
        completion = client.chat.completions.create(
            model="gpt-4-0125-preview",
            messages = message_list
        )
        token1 = completion.choices[0].message.content
        print(token1)
    elif token == "FT":
        message_list = FT_message_list.copy()
        message_list.append({"role": "user", "content": sentence})
        completion = client.chat.completions.create(
            model="gpt-4-0125-preview",
            messages = message_list
        )
        tokenFT = completion.choices[0].message.content
        print(tokenFT)
        sentence1 = input()
        message_list = FT_message_list1.copy()
        message_list.append({"role": "user", "content": sentence})
        message_list.append({"role": "user", "content": sentence1})
        completion = client.chat.completions.create(
            model="gpt-4-0125-preview",
            messages = message_list
        )
        token1 = completion.choices[0].message.content
        print(token1)
    elif token == "N":
        next_sentence = "I don't understand."
        print(next_sentence)
    else:
        next_sentence = token
        print(next_sentence)
