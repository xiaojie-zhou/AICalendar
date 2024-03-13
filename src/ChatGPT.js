import React, {useState} from 'react';

import OpenAI from "openai";
import {simpletask} from "./todoistapi.js";
import {floatingtask} from "./todoistapi.js";
import {tasks} from "./todoistapi.js";
import {deletetask} from "./todoistapi.js";
import {modtask} from "./todoistapi.js";


const prompts = [
    {"role": "system", "content": "The input will be either adding, deleting, or modifying a schedule."},
    {"role": "system", "content": "A simple event is an event that has a specific time and duration."},
    {
        "role": "system",
        "content": "A floating event or a task is an event that has a duration, but has not been assigned to a time yet."
    },
    {
        "role": "system",
        "content": "A task is an event that has a specific deadline, has a required time to complete, and can be broken up into segments."
    },
    {
        "role": "system",
        "content": "Your mission is to identify whether the user's input is a simple event, a floating event, a task, or something else."
    },
    {"role": "system", "content": "If the user inputs a simple event, say S."},
    {"role": "system", "content": "If the user inputs a floating event or a task, ask them if it can be interrupted."},
    {
        "role": "system",
        "content": "If the user replies no after asking them if it can be interrupted, it's a floating event, say F, and do your mission from the start."
    },
    {
        "role": "system",
        "content": "If the user replies yes after asking them if it can be interrupted, it's a task, say T, and reset."
    },
    {"role": "system", "content": "If the user is trying to delete an existing schedule, say D, don't say anything else."},
    {"role": "system", "content": "If the user is trying to modify an existing schedule, say M, don't say anything else."},
    {"role": "system", "content": "If the user inputs something else, say N."}
]

const S_message_list = [
    {"role": "system", "content": "You need to make the output like: {\"content\": \"\", \"time\": \"\"}"},
    {"role": "system", "content": "The input will be schedules."},
    {
        "role": "system",
        "content": "Extract the Title, the Time, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."
    },
    {
        "role": "system",
        "content": "For example, if the input is 'I have a class every monday and wednesday 2-4pm', output '{\"content\": \"Class\", \"description\": \"N/A\", \"day\": \"Monday, Wednesday\", \"time\": \"2pm\", \"duration\": \"120\"}'"
    },
    {
        "role": "system",
        "content": "If the input lack some of the information, insert N/A, For example, if the input is 'I have a class on 3/16 at 1pm with Prof. Nicki', output '{\"content\": \"Class\", \"description\": \"Prof. Nicki\", \"day\": \"2024-03-16\", \"time\": \"1pm\", \"duration\": \"N/A\"}'"
    },
    {
        "role": "system",
        "content": "The description label stands for any detailed information that user input, if there's no, insert N/A."
    },
    {
        "role": "system",
        "content": "The day label stands for either date and day, if both are provided, insert the date with the format 2024-MM-DD."
    },
    {
        "role": "system",
        "content": "If the task is repetitive, specify every in the day label. For example, every Monday. If a specific date is provided, just insert the date."
    },
    {
        "role": "system",
        "content": "Repetitive: every monday, etc. Non-repetitive: this Monday, next Monday, etc."
    },
    {
        "role": "system",
        "content": "If the user input something like next Monday, this Tueday, etc., just insert next Monday, this Tueday, etc. If which week is not specify, the default is this week."
    },
    {
        "role": "system",
        "content": "If am and pm is not specified, the default values are 12pm, 1pm, 2pm, 3pm, 4pm, 5pm, 6pm, 7pm, 8pm, 9am, 10am, and 11am."
    },
    {
        "role": "system",
        "content": "The duration label should be set in minutes. For example, 2 hours = 120, 3 hours = 180."
    }
]

const FT_message_list = [
    {"role": "system", "content": "The input will be schedules."},
    {
        "role": "system",
        "content": "Extract the Title, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."
    },
    {
        "role": "system",
        "content": "For example, if the input is 'I have to do the laundry this Tuesday, and it takes 2 hours', output '{\"content\": \"Laundry\", \"description\": \"N/A\", \"day\": \"this Tuesday\", \"duration\": \"120\"}'"
    },
    {
        "role": "system",
        "content": "If the input lack some of the information, insert N/A, For example, if the input is 'I have to do homework for Calculus class on 3/16, output '{\"content\": \"Homework\", \"description\": \"Calculus class\", \"day\": \"2024-03-16\", \"duration\": \"N/A\"}'"
    },
    {
        "role": "system",
        "content": "The description label stands for any detailed information that user input, if there's no, insert N/A."
    },
    {
        "role": "system",
        "content": "The day label stands for either date and day, if both are provided, insert the date with the format 2024-MM-DD."
    },
    {
        "role": "system",
        "content": "If the user input something like next Monday, this Tueday, etc., just insert next Monday, this Tueday, etc. If which week is not specify, the default is this week."
    },
    {
        "role": "system",
        "content": "The duration label should be set in minutes. For example, 2 hours = 120, 3 hours = 180."
    }
]

const FT_message_list1 = [
    {"role": "system", "content": "The input will be schedules."},
    {"role": "system", "content": "You need to make the output like: Title: ; Time: ; Date: ; Duration: ."},
    {
        "role": "system",
        "content": "Ask them if it can be interrupted, and check the total duration of the event if not mentioned."
    },
    {
        "role": "system",
        "content": "If the user replys no after asking them if it's interruptible, let Time be NA, and extract the Title, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."
    },
    {
        "role": "system",
        "content": "If the user replys yes after asking them if it's interruptible, let Time be NA, and extract the Title, the Date (if mentioned. make sure to mention if it's repetitve), and the Duartion (if mentioned) of the event."
    }
]

const DM_message_list = [
    {"role": "system", "content": "These are the existing schedules in JSON format."},
]

const D_message_list2 = [
    {
        "role": "system",
        "content": "If you find the existing task that the user is trying to delete, output the TaskID only, don't say anything else."
    },
    {
        "role": "system",
        "content": "If you cannot find the existing task that the user is trying to delete, output N/A."
    },
    {
        "role": "system",
        "content": "If the time or description the user provided is unclear, just output the most relevant TaskID, or output N/A if there's no most relevant schedule."
    }
]

const M_message_list2 = [
    {
        "role": "system",
        "content": "If you find the existing task that the user is trying to modify, output the TaskID and the information that the user wants to modify in the format of '{\"ID\": \"Something\", \"content\": \"Something\", \"description\": \"Something\", \"day\": \"Something\", \"time\": \"Something\", \"duration\": \"Something\"}'."
    },
    {
        "role": "system",
        "content": "The description label stands for any detailed information that user input, if there's no, insert N/A."
    },
    {
        "role": "system",
        "content": "The day label stands for either date and day, if both are provided, insert the date with the format 2024-MM-DD."
    },
    {
        "role": "system",
        "content": "If am and pm is not specified, the default values are 12pm, 1pm, 2pm, 3pm, 4pm, 5pm, 6pm, 7pm, 8pm, 9am, 10am, and 11am."
    },
    {
        "role": "system",
        "content": "The duration label should be set in minutes. For example, 2 hours = 120, 3 hours = 180."
    },
    {
        "role": "system",
        "content": "If the user didn't provide information on a specific field, just insert N/A in that field."
    },
    {
        "role": "system",
        "content": "For example, if the user wants to change a date on 2/20 to 2pm, output '{\"ID\": \"The ID of the schedule\", \"content\": \"Date\", \"description\": \"N/A\", \"day\": \"2024-02-20\", \"time\": \"2pm\", \"duration\": \"N/A\"}'."
    },
    {
        "role": "system",
        "content": "For example, the user wants to change a meeting on 4/12 to 5pm - 7pm, output '{\"ID\": \"The ID of the schedule\", \"content\": \"Meeting\", \"description\": \"N/A\", \"day\": \"2024-04-12\", \"time\": \"5pm\", \"duration\": \"120\"}'."
    },
    {
        "role": "system",
        "content": "If you cannot find the existing task that the user is trying to modify, output N/A in the ID field."
    },
    {
        "role": "system",
        "content": "If the time or description the user provided is unclear, just output the most relevant TaskID in the ID field, or output N/A in the ID field if there's no most relevant schedule."
    }
]

let stored_list = []

function ChatGPT() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{sender: 'ai', text: 'How can I help you?'}]);
    let message_list = []

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = {text: input, sender: 'user'};
        setMessages([...messages, userMessage]);

        const client = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
        try {
            message_list.push(...prompts)
            stored_list.push({"role": "user", "content": input})
            const response = await client.chat.completions.create({
                model: 'gpt-4-0125-preview',
                messages: message_list.concat(stored_list)
            });
            let text = response.choices[0].message.content

            let next_sentence = ''
            if (text === "S") {
                let message_s = []
                const response = await client.chat.completions.create({
                    model: 'gpt-4-0125-preview',
                    messages: S_message_list.concat(stored_list)
                });

                let data_str = response.choices[0].message.content;
                let content = '';
                let description = '';
                let duestring = '';
                let duration = 60;
                let duration_unit = 'minute';
                try {
                    let data = JSON.parse(data_str)
                    content = data['content'];
                    if (data['description'] !== 'N/A') {
                        description = data['description'];
                    }
                    if (data['day'] !== 'N/A') {
                        duestring = data['day'];
                    }
                    if (data['time'] !== 'N/A') {
                        duestring = duestring.concat(' ', data['time']);
                    }
                    if (data['duration'] !== 'N/A') {
                        duration = parseInt(data['duration']);
                    }
                    console.log(JSON.stringify(data));
                } catch (e) {
                    console.log(e)
                }
                let success = await simpletask(content, description, duestring, duration, duration_unit)
                if (success === true)
                    next_sentence = "Event Added.";
                else
                    next_sentence = "Something went wrong. Check console.";
                message_list = [];
                stored_list = [];
            } else if (text === "F") {
                stored_list.pop();
                const response = await client.chat.completions.create({
                    model: 'gpt-4-0125-preview',
                    messages: FT_message_list.concat(stored_list)
                });

                let data_str = response.choices[0].message.content;
                let content = '';
                let description = '';
                let duestring = '';
                let duration = 60;
                let duration_unit = 'minute';
                try {
                    let data = JSON.parse(data_str)
                    content = data['content'];
                    if (data['description'] !== 'N/A') {
                        description = data['description'];
                    }
                    if (data['day'] !== 'N/A') {
                        duestring = data['day'];
                    }
                    if (data['duration'] !== 'N/A') {
                        duration = parseInt(data['duration']);
                    }
                    console.log(JSON.stringify(data));
                } catch (e) {
                    console.log(e)
                }
                let success = await floatingtask(content, description, duestring, duration, duration_unit)
                if (success === 'Error')
                    next_sentence = "Something went wrong. Check console.";
                else if (success === 'Cannot')
                    next_sentence = "Cannot Add the Event.";
                else
                    next_sentence = "Event Is Added to".concat(" ", success);
                message_list = [];
                stored_list = [];
            } else if (text === "T") {
                stored_list.pop();
                const response = await client.chat.completions.create({
                    model: 'gpt-4-0125-preview',
                    messages: FT_message_list.concat(stored_list)
                });

                let data_str = response.choices[0].message.content;
                let content = '';
                let description = '';
                let duestring = '';
                let duration = 60;
                let duration_unit = 'minute';
                try {
                    let data = JSON.parse(data_str)
                    content = data['content'];
                    if (data['description'] !== 'N/A') {
                        description = data['description'];
                    }
                    if (data['day'] !== 'N/A') {
                        duestring = data['day'];
                    }
                    if (data['duration'] !== 'N/A') {
                        duration = parseInt(data['duration']);
                    }
                    console.log(JSON.stringify(data));
                } catch (e) {
                    console.log(e)
                }
                let success = await tasks(content, description, duestring, duration, duration_unit)
                if (success === 'Error')
                    next_sentence = "Something went wrong. Check console.";
                else if (success === 'Cannot')
                    next_sentence = "Cannot Add the Event.";
                else
                    next_sentence = "Task Is Added";
                message_list = [];
                stored_list = [];
            } else if (text === "N") {
                next_sentence = "I don't understand.";
                message_list = [];
                stored_list = [];
            } else if (text === "D") {
                if (window.localStorage.getItem("tasks") !== null) {
                    let tasks = [];
                    let tasks_json = window.localStorage.getItem("tasks");
                    tasks.push({"role": "system", "content": tasks_json})
                    const response = await client.chat.completions.create({
                        model: 'gpt-4-0125-preview',
                        messages: DM_message_list.concat(tasks).concat(D_message_list2).concat(stored_list)
                    });
                    let task_id = response.choices[0].message.content;
                    let success = await deletetask(task_id)
                    if (success === true)
                        next_sentence = "Event Deleted.";
                    else
                        next_sentence = "Cannot delete the event.";
                    }
                else {
                    next_sentence = "There is no existing events.";
                }
                message_list = [];
                stored_list = [];
            } else if (text === "M") {
                if (window.localStorage.getItem("tasks") !== null) {
                    let tasks = [];
                    let tasks_json = window.localStorage.getItem("tasks");
                    tasks.push({"role": "system", "content": tasks_json})
                    const response = await client.chat.completions.create({
                        model: 'gpt-4-0125-preview',
                        messages: DM_message_list.concat(tasks).concat(M_message_list2).concat(stored_list)
                    });

                    let data_str = response.choices[0].message.content;
                    let task_id = '';
                    let content = '';
                    let description = '';
                    let duestring = '';
                    let duration = '';
                    try {
                        let data = JSON.parse(data_str)
                        task_id = data['ID'];
                        content = data['content'];
                        if (data['description'] !== 'N/A') {
                            description = data['description'];
                        }
                        if (data['day'] !== 'N/A') {
                            duestring = data['day'];
                        }
                        if (data['time'] !== 'N/A') {
                            duestring = duestring.concat(' ', data['time']);
                        }
                        if (data['duration'] !== 'N/A') {
                            duration = data['duration'];
                        }
                        console.log(JSON.stringify(data));
                    } catch (e) {
                        console.log(e)
                    }

                    if (task_id !== 'N/A') {
                        let success = await modtask(task_id, content, description, duestring, duration)
                        if (success === true)
                            next_sentence = "Event Modified.";
                        else
                            next_sentence = "Something went wrong. Check console.";
                    } else
                    next_sentence = "Cannot modify the event.";
                } else 
                    next_sentence = "There is no existing events.";
                message_list = [];
                stored_list = [];
            } else
                next_sentence = text

            const aiMessage = {sender: 'ai', text: next_sentence};

            setMessages(messages => [...messages, aiMessage]);
            //window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            setMessages(messages => [...messages, {text: 'Error getting response.', sender: 'ai'}]);
        }

        setInput('');
    };
    
    return (
        <div>
            <div className="chat-box" style={{maxHeight: '20vh', overflowX: 'hidden', overflowY: 'scroll'}}>
                {messages.map((msg, idx) => (
                    <p key={idx} className={'chat_' + msg.sender}>
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