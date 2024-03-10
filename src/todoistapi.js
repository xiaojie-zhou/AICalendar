import {TodoistApi} from "@doist/todoist-api-typescript";

const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);

export function simpletask(content, duestring) {
    try{
        let task = todoist.addTask({
        content: content,
        dueString: duestring,
        dueLang: "en"
        })
        return true;
    }
    catch(e){
        console.log(e)
        return false;
    }
}


