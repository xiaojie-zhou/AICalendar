import React, { useState } from 'react';

import OpenAI from "openai";
import {TodoistApi} from '@doist/todoist-api-typescript';

let prompts = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "A simple event is an event that has a specific time and duration."},
    {"role": "system",
        "content": "A floating event or a task is an event that has a duration, but has not been assigned to a time yet."},
    {"role": "system",
        "content": "A task is an event that has a specific deadline, has a required time to complete, and can be broken up into segments."},
    {"role": "system",
        "content": "Your mission is to identify whether the user's input is a simple event, a floating event, a task, or something else."},
    {"role": "system", "content": "If the user inputs a simple event, say S."},
    {"role": "system", "content": "If the user inputs a floating event or a task, ask them if it can be interrupted."},
    {"role": "system",
        "content": "If the user replies no after asking them if it can be interrupted, it's a floating event, say F, and do your mission from the start."},
    {"role": "system",
        "content": "If the user replies yes after asking them if it can be interrupted, it's a task, say T, and reset."},
    {"role": "system", "content": "If the user inputs something else, like not a schedule, say N."}
]

let message_list = []

function ChatGPT() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{sender:'ai', text: 'How can I help you?'}]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        const client = new OpenAI({apiKey:process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

        try {
            message_list.push(...prompts)
            message_list.push({"role": "user", "content": input})
            const response = await client.chat.completions.create({
                model: 'gpt-4-0125-preview',
                messages: message_list
            });
            let text = response.choices[0].message.content

            let next_sentence=''
            if (text === "S") {
                next_sentence = "This is a simple event.";

                const token = process.env.REACT_APP_TODOIST
                const todoist = new TodoistApi(token);
                let project_id ='2203598416'

                todoist.addTask({ content: "Buy Milk", projectId: project_id })
                    .then((task) => console.log(task))
                    .catch((error) => console.log(error))



                message_list = [];
            }
            else if (text === "F"){
                next_sentence = "This is a floating event.";
                message_list = [];
            }
            else if (text === "T"){
                next_sentence = "This is a task.";
                message_list = [];
            }

            else if (text === "N")
                next_sentence = "I don't understand.";
            else
                next_sentence = text

            const aiMessage = {sender:'ai', text: next_sentence};

            setMessages(messages => [...messages, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(messages => [...messages, { text: 'Error getting response.', sender: 'ai' }]);
        }

        setInput('');
    };

    return (
        <div>
            <div className="chat-box" style={{maxHeight:'20vh',overflowX:'hidden', overflowY:'scroll'}}>
                {messages.map((msg, idx) => (
                    <p key={idx} className={'chat_'+msg.sender}>
                        {msg.text}
                    </p>
                ))}
            </div>

            <form className="input-group mb-3" onSubmit={handleSubmit}>
                <input
                    className="form-control"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something...😊"
                />
                <button type="submit" className="btn btn-outline-secondary">Submit</button>
            </form>
        </div>
    );
}

export default ChatGPT;
