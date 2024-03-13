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

        let tasks = {};
        if (window.localStorage.getItem("tasks") !== null)
            tasks = JSON.parse(window.localStorage.getItem("tasks"));
        let string = "TaskID: ".concat(task['id']);
        let string_content = task['content'].concat(" on ", date).concat(" at ", time);
        tasks[string] = string_content;
        window.localStorage.setItem("tasks", JSON.stringify(tasks));

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

export async function tasks(content, description_, duestring, duration_, duration_unit) {
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
        let duration = duration_/60;
        let arr = new Array(24).fill(0);
        let task_map = {};

        const today = new Date();
        const difference = Math.floor((Date.parse(date) - today) / (1000*60*60*24)) + 1;
        let dailyduration = Math.ceil(duration_/60/difference);

        let date_cur = new Date();
        date_cur.setDate(today.getDate()+1)
        let date_cur_str = date_cur.toISOString().slice(0, 10);
        console.log(date_cur_str);

        if (window.localStorage.getItem("task_map") !== null)
            task_map = JSON.parse(window.localStorage.getItem("task_map"));

        if (task_map.hasOwnProperty(date_cur_str)) {
            let i = 9;
            let count = 0;
            let start_time = 24;
            let first_attempt = false;
            while (i < 24) {
                if (task_map[date_cur_str][i] === 0) {
                    i++;
                    count++;
                }
                else {
                    i++;
                    count = 0;
                }
                if (count >= dailyduration) {
                    start_time = i - dailyduration;
                    first_attempt = true;
                    break;
                }
            }
            i = 6;
            count = 0;
            while (i < 24 && !first_attempt) {
                if (task_map[date_cur_str][i] === 0) {
                    i++;
                    count++;
                }
                else {
                    i++;
                    count = 0;
                }
                if (count >= dailyduration) {
                    start_time = i - dailyduration;
                    break;
                }
            }
            //console.log(start_time);
            //console.log("checkpoint1");
            if (start_time !== 24) {
                assigned_time = start_time.toString();
                console.log(dailyduration)
                let new_task = await todoist.updateTask(id, {
                    dueString: date_cur_str.concat(" at ", assigned_time),
                    duration: dailyduration*60,
                    durationUnit: duration_unit
                })
                let date_nxt = new Date();
                date_nxt.setDate(date_cur.getDate()+1);
                duration = duration - dailyduration;
                dailyduration = Math.min(duration, dailyduration);
                let success = await subtask(content, description_, date_nxt, dailyduration*60, duration_unit, duration*60)
                if (success === 'Cannot'){
                    await todoist.deleteTask(id);
                    return 'Cannot'
                }

                //console.log("checkpoint2");
                time = parseInt(new_task['due']['datetime'].slice(11, 13));
                arr = task_map[date_cur_str];

                for (let i = time; i < time + dailyduration; i++) {
                    arr[i] = 1;
                }

                task_map[date_cur_str] = arr;
                console.log(task_map[date_cur_str]);
            }
            else {
                todoist.deleteTask(id);
                return 'Cannot';
            }
        }
        else {
            for (let i = time; i < time + dailyduration; i++) {
                arr[i] = 1;
            }
            await todoist.updateTask(id, {
                dueString: date_cur_str.concat(" at ", assigned_time),
                duration: dailyduration*60,
                durationUnit: duration_unit
            })
            let date_nxt = new Date();
            date_nxt.setDate(date_cur.getDate()+1);
            duration = duration - dailyduration;
            let success = await subtask(content, description_, date_nxt, dailyduration*60, duration_unit, duration*60)
            if (success === 'Cannot'){
                await todoist.deleteTask(id);
                return 'Cannot'
            }
            task_map[date_cur_str] = arr;
            console.log(task_map[date_cur_str]);
        }


        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        return 'Success';
    }
    catch(e){
        console.log(e)
        return 'Error';
    }
}

export async function subtask(content, description_, date_cur, duration_, duration_unit, total_duration) {
    let assigned_time = "9am";
    try{
        console.log(duration_)
        if (!duration_){
            return 'Success'
        }
        let date_cur_str = date_cur.toISOString().slice(0, 10);
        let date_nxt = new Date();
        date_nxt.setDate(date_cur.getDate()+1);
        let task = await todoist.addTask({
            content: content,
            description: description_,
            dueString: date_cur_str.concat(" ", assigned_time),
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
                    dueString: date_cur_str.concat(" at ", assigned_time),
                })
                total_duration = total_duration - duration_;
                console.log(total_duration);
                let newduration = Math.min(duration_,total_duration)
                console.log(newduration);
                let success = await subtask(content, description_, date_nxt, newduration, duration_unit, total_duration)
                if (success === 'Cannot'){
                    await todoist.deleteTask(id);
                    return 'Cannot'
                }

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
                await todoist.deleteTask(id);
                return 'Cannot';
            }
        }
        else {
            total_duration = total_duration - duration_;
            console.log(total_duration);
            let newduration = Math.min(duration_,total_duration)
            console.log(newduration);
            let success = await subtask(content, description_, date_nxt, newduration, duration_unit, total_duration)
            if (success === 'Cannot'){
                await todoist.deleteTask(id);
                return 'Cannot'
            }
            for (let i = time; i < time + duration; i++) {
                arr[i] = 1;
            }
            task_map[date] = arr;
            console.log(task_map[date]);
        }

        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        return 'Success';
    }
    catch(e){
        console.log(e)
        return 'Error';
    }
}

export async function deletetask(task_id) {
    try {
        console.log(task_id)
        let task = await todoist.getTask(task_id);
        let date = task['due']['datetime'].slice(0, 10);
        let time = parseInt(task['due']['datetime'].slice(11, 13));
        let duration = task['duration']['amount']/60;
        let arr = new Array(24).fill(0);
        let task_map = {};

        if (window.localStorage.getItem("task_map") !== null)
            task_map = JSON.parse(window.localStorage.getItem("task_map"));
        else
            return false;

        if (task_map.hasOwnProperty(date)) {
            arr = task_map[date];
        }
        else
            return false;

        for (let i = time; i < time + duration; i++) {
            arr[i] = 0;
        }

        task_map[date] = arr;
        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        console.log(task_map[date]);

        let d_task = await todoist.deleteTask(task_id);

        let tasks = JSON.parse(window.localStorage.getItem("tasks"));
        let string = "TaskID: ".concat(task_id);
        delete tasks[string];
        window.localStorage.setItem("tasks", JSON.stringify(tasks));
        return true;
    }
    catch(e) {
        console.log(e)
        return false;
    }
}

export async function modtask(task_id, content_, description_, duestring, duration_) {
    try {
        console.log(task_id)
        let task = await todoist.getTask(task_id);
        let date = task['due']['datetime'].slice(0, 10);
        let time = parseInt(task['due']['datetime'].slice(11, 13));
        let duration = task['duration']['amount'];
        let arr = new Array(24).fill(0);
        let task_map = {};

        if (window.localStorage.getItem("task_map") !== null)
            task_map = JSON.parse(window.localStorage.getItem("task_map"));
        else
            return false;

        if (task_map.hasOwnProperty(date)) {
            arr = task_map[date];
        }
        else
            return false;

        let tasks = JSON.parse(window.localStorage.getItem("tasks"));
        let string = "TaskID: ".concat(task_id);
        
        let new_content = task['content'];
        let new_description = task['description'];
        let new_duestring = task['due']['string'];
        let new_duration = duration;

        if (content_.length !== 0)
            new_content = content_;
        if (description_.length !== 0)
            new_description = description_;
        if (duestring.length !== 0)
            new_duestring = duestring;
        if (duration_.length !== 0)
            new_duration = parseInt(duration_);
        console.log(new_duration)

        let m_task = await todoist.updateTask(task_id, {
        content: new_content,
        description: new_description,
        dueString: new_duestring,
        duration: new_duration,
        durationUnit: 'minute'
        });

        let new_date = m_task['due']['datetime'].slice(0, 10);
        let new_time = parseInt(m_task['due']['datetime'].slice(11, 13));

        let string_content = task['content'].concat(" on ", new_date).concat(" at ", new_time);
        tasks[string] = string_content;
        window.localStorage.setItem("tasks", JSON.stringify(tasks));

        let duration_hour = duration/60;

        for (let i = time; i < time + duration_hour; i++) {
            arr[i] = 0;
        }

        let n_arr = new Array(24).fill(0);

        if (task_map.hasOwnProperty(new_date)) {
            n_arr = task_map[new_date];
        }
        
        let new_duration_hour = new_duration/60;
        for (let i = new_time; i < new_time + new_duration_hour; i++) {
            n_arr[i] = 1;
        }
        
        task_map[new_date] = n_arr;
        window.localStorage.setItem("task_map", JSON.stringify(task_map));
        console.log(task_map[new_date]);

        return true;
    }
    catch(e) {
        console.log(e)
        return false;
    }
}