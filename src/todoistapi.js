import {TodoistApi} from "@doist/todoist-api-typescript";

const todoist = new TodoistApi(process.env.REACT_APP_TODOIST);

export async function simpletask(content, description_, duestring, duration_, duration_unit) {
    try{
        let task = await todoist.addTask({
        content: content,
        description: description_,
        dueString: duestring,
        dueLang: 'en',
        duration: duration_,
        durationUnit: duration_unit
        })
        
        let date = task['due']['datetime'].slice(0, 10);
        let time = parseInt(task['due']['datetime'].slice(11, 13));
        let duration = task['duration']['amount']/60;
        let arr = new Array(24).fill(0);
        let task_map = {};

        if (window.localStorage.getItem("task_map") !== null)
            task_map = JSON.parse(window.localStorage.getItem("task_map"));

        if (task_map.hasOwnProperty(date)) {
            arr = task_map[date];
        }

        for (let i = time; i < time + duration; i++) {
            arr[i] = 1;
        }

        task_map[date] = arr;
        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        console.log(task_map[date]);

        return true;
    }
    catch(e){
        console.log(e)
        return false;
    }
}

export async function floatingtask(content, description_, duestring, duration_, duration_unit) {
    let assigned_time = "9am";
    try{
        let task = await todoist.addTask({
        content: content,
        description: description_,
        dueString: duestring.concat(" ", assigned_time),
        dueLang: 'en',
        duration: duration_,
        durationUnit: duration_unit
        })

        let id = task['id'];
        let date = task['due']['datetime'].slice(0, 10);
        let time = parseInt(task['due']['datetime'].slice(11, 13));
        let duration = task['duration']['amount']/60;
        let arr = new Array(24).fill(0);
        let task_map = {};

        if (window.localStorage.getItem("task_map") !== null)
            task_map = JSON.parse(window.localStorage.getItem("task_map"));

        if (task_map.hasOwnProperty(date)) {
            let i = 9;
            let count = 0;
            let start_time = 24;
            let first_attempt = false;
            while (i < 24) {
                if (task_map[date][i] === 0) {
                    i++;
                    count++;
                }
                else {
                    i++;
                    count = 0;
                }
                if (count >= duration) {
                    start_time = i - duration;
                    first_attempt = true;
                    break;
                }
            }
            i = 6;
            count = 0;
            while (i < 24 && !first_attempt) {
                if (task_map[date][i] === 0) {
                    i++;
                    count++;
                }
                else {
                    i++;
                    count = 0;
                }
                if (count >= duration) {
                    start_time = i - duration;
                    break;
                }
            }
            //console.log(start_time);
            //console.log("checkpoint1");
            if (start_time !== 24) {
                assigned_time = start_time.toString();

                let new_task = await todoist.updateTask(id, {
                dueString: duestring.concat(" at ", assigned_time),
                })

                //console.log("checkpoint2");
                time = parseInt(new_task['due']['datetime'].slice(11, 13));
                arr = task_map[date];

                for (let i = time; i < time + duration; i++) {
                    arr[i] = 1;
                }

                task_map[date] = arr;
                console.log(task_map[date]);
            }
            else {
                todoist.deleteTask(id);
                return 'Cannot';
            }
        }
        else {
            for (let i = time; i < time + duration; i++) {
                arr[i] = 1;
            }
            task_map[date] = arr;
            console.log(task_map[date]);
        }
        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        return time;
    }
    catch(e){
        console.log(e)
        return 'Error';
    }
}