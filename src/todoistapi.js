import {TodoistApi} from "@doist/todoist-api-typescript";

const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);

export function simpletask(content, description_, duestring, duration_, duration_unit) {
    try{
        let task = todoist.addTask({
        content: content,
        description: description_,
        dueString: duestring,
        dueLang: 'en',
        duration: duration_,
        durationUnit: duration_unit
        })
        return true;
    }
    catch(e){
        console.log(e)
        return false;
    }
}


