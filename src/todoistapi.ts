/* eslint-disable no-console */
const {TodoistApi} = require('@doist/todoist-api-typescript')
const token = '9fb5ef8fd11a54d920f332ee2ed835ea7d9f5694'
const todoist = new TodoistApi(token)

// todoist.getprojects()
//
function addSimpletask (name, time){
    let project_id ='2203598416'
    todoist.addTask({ content: name, projectId: project_id })
    .then((task) => console.log(task))
    .catch((error) => console.log(error))
}
