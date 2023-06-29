import Task from "../../models/Task.js";


export const createT = async(taskBody)=> {
     const task = await Task.create(taskBody)
     return task
}

export const findById = async(taskBody)=>{
    const task = await Task.findOne(taskBody);
    return task
}

export const getT = (reqQuery) =>{
    const sort = {};
    const match = {};
    if (reqQuery.completed) {
      match.completed = reqQuery.completed === "true";
    }
  
    if (reqQuery.sortBy) {
      const parts = reqQuery.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
  
    const limit = parseInt(reqQuery.limit);
    const skip = parseInt(reqQuery.skip);
    return { match, sort, limit, skip };
  }



export const findUser = async(_id, reqUser) =>{
    const task =await Task.findOne({
      _id: _id,
      owner_id: reqUser,
    });
    return task;
  }


export function validTask(updates) {
    const allowedUpdates = ["description", "completed"];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    return isValidOperation;
  }

export const upTask = async(task, updates, reqBody) =>{
    updates.forEach(update => {
        (task[update] = reqBody[update])
    });
    await task.save();
    return task;
  }
  
export const delTask= async(taskId, ownerId) =>{
    const task = await Task.findOneAndDelete({
        _id:taskId,
        owner_id:ownerId
    });
    return task;
  }