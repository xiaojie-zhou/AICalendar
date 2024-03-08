import {TodoistApi} from "@doist/todoist-api-typescript";
// const TodoistApi = require('@doist/todoist-api-typescript');
//
// const token = process.env.REACT_APP_TODOIST;
const todoist = new TodoistApi("9fb5ef8fd11a54d920f332ee2ed835ea7d9f5694");
let project_id ='2203598416'

export async function simpletask(name, time) {
    todoist.addTask({
        content: "Buy Milk",
        projectId: project_id
    })
    .then((task) => console.log(task))
    .catch((error) => console.log(error))
}


