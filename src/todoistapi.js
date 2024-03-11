import {TodoistApi} from "@doist/todoist-api-typescript";

const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);
const task_map = new Map();

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

export function floatingtask(content, description_, duestring, duration_, duration_unit) {
    //try{
    //    let all_tasks = todoist.getTasks();
    //    for (const task of all_tasks) {
    //        task_map.set(task[due][date], true);
    //    }
    //}
    //catch(e){
    //    console.log(e)
    //    return false;
    //}
    let assigned_time = "9am";
    try{
        let task = todoist.addTask({
        content: content,
        description: description_,
        dueString: duestring.concat(" ", assigned_time),
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