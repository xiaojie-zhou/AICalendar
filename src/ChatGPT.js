import React, { useState } from 'react';

import OpenAI from "openai";

function ChatGPT() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        const client = new OpenAI({apiKey:process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

        try {
            let message_list = [
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
            message_list.push({"role": "user", "content": input})
            const response = await client.chat.completions.create({
                model: 'gpt-4-0125-preview',
                messages: message_list
            });

            const aiMessage = {sender:'ai', text: response.choices[0].message.content};
            setMessages(messages => [...messages, aiMessage]);
        } catch (error) {
            console.error('Error calling OpenAI:', error);
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
