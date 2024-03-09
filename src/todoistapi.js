import {TodoistApi} from "@doist/todoist-api-typescript";
// const TodoistApi = require('@doist/todoist-api-typescript');
//
// const token = process.env.REACT_APP_TODOIST;
const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);
let project_id =process.env.REACT_APP_TODOIST_Project

export async function simpletask(name, time) {
    todoist.addTask({
        content: "Buy Milk",
        projectId: project_id
    })
    .then((task) => console.log(task))
    .catch((error) => console.log(error))
}


