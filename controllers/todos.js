const Todo = require("../models/todo");
const validations = require("../validations/todos");

exports.createTodo = (req, res, next) => {
    // console.log(req.body);
    if (!Object.entries(req.body).length) {
        return res.status(400).json({message: "Missing Todo Object"});
    }

    const result = validations.createTodoValidation(req.body);
    if (result) {
        return res.status(400).json({message: result.message});
    }
    
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        dateCreated: new Date().toISOString(),
        userId: req.userData.userId
    });
    todo.save()
    .then((result) => {
        res.status(201).json({
            message: "Todo successfully created!",
            todoId: result._id
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({message: "Error in creating a Todo!"});
    });
    // console.log(todo);
}

exports.getTodos = (req, res, next) => {
    // + to parse string(query params) into integer value.
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    const query = Todo.find({userId: req.userData.userId});
    let documents;
    // Mongoose allow chaining of query its like: Todo.find().skip().limit().then();
    // A check to see if i have recevied query params or not, if not i will simply return all todos of the user who requested them.
    if (pageSize && pageIndex) {
        // console.log("Got pageSize: " + pageSize + "and pageIndex: " + pageIndex);
        query
        .skip(pageSize * (pageIndex-1))
        .limit(pageSize);
    }
    // My query will be not executed untill I use .then() because it returns promise
    query
    .then((docs) => {
        documents = docs;
        return Todo.countDocuments({userId: req.userData.userId});
        // As Todo.countDocuments() returns a promise and I can get its result in next then() block which is number of documents.
    })
    .then((count) => {
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: documents,
            count: count
        });
    })
    .catch((err) => {
        res.status(500).json({message: "Fetching the todos failed!"});
    });
}

exports.getTodo = async (req, res, next) => {
    try {
        const result = await Todo.findById(req.params.id);
    } catch {
        return res.status(400).json({message: "Todo with the given ID not found"});
    }
    // console.log(req.params.id);
    Todo.findOne({_id: req.params.id, userId: req.userData.userId})
    .then((result) => {
        if (result) {
            res.status(200).json({todo: result});
        }
        else {
            console.log(result, "result");
            res.status(404).json({message: "Todo not found!"});
        }
    })
    .catch((err) => {
        res.status(500).json({
            message: "Fetching the todo failed!"
        });
    });
}

exports.updateTodo = async (req, res, next) => {
    if (!Object.entries(req.body).length) {
        return res.status(400).json({message: "Missing Todo Object"});
    }

    try {
        const result = await Todo.findById(req.params.id);
    } catch {
        return res.status(400).json({message: "Todo with the given ID not found"});
    }

    const result = validations.updateTodoValidation(req.body);
    if (result) {
        return res.status(400).json({message: result.message});
    }

    console.log(req.body);
    console.log(req.params.id);
    const todo = new Todo({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath,
        dateUpdated: new Date().toISOString(),
        updated: true,
        userId: req.userData.userId
    });
    Todo.updateOne({_id: req.params.id, userId: req.userData.userId}, todo, {runValidators: true})
    .then((result) => {
        if (result.nModified > 0) {
            res.status(200).json({message: "Todo updated successfully!"});
        } else {
            res.status(404).json({ message: "Todo not found!" });
        }
        // console.log(result);
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't update the todo!"});
        // res.status(500).json({message: err.message});
    });
}

exports.deleteTodos = (req, res, next) => {
    Todo.remove({})
    .then((result) => {
        console.log(result);
        res.status(200).json({message: "Deleted all todos successfully"});
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't delete the todos!"});
    });
}

exports.deleteTodo = async (req, res, next) => {
    try {
        const result = await Todo.findById(req.params.id);
    } catch {
        return res.status(400).json({message: "Todo with the given ID not found"});
    }
    console.log(req.params.id);
    Todo.deleteOne({_id: req.params.id})
    .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({message: "Todo deleted successfully"});
        } else {
            res.status(404).json({message: "Todo not found"});
        }
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't delete the todo!"});
    });
}
