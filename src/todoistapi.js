import {TodoistApi} from "@doist/todoist-api-typescript";
// const TodoistApi = require('@doist/todoist-api-typescript');

const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);

export async function simpletask(name, time) {
    todoist.addTask({
        content: name,
        dueString: time,
        dueLang: "en",

    })
    .then((task) => {
        console.log(task);
        return true;
        })
    .catch((error) => {
        console.log(error)
        return false;
    })

}


