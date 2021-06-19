const Todo = require("../models/todo");


exports.createTodo = (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({message: "Missing required fields"});
    }
    // console.log(req.body);
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
    if (pageSize && pageIndex) {
        // console.log("Got pageSize: " + pageSize + "and pageIndex: " + pageIndex);
        query
        .skip(pageSize * (pageIndex-1))
        .limit(pageSize);
    }
    query
    .then((docs) => {
        documents = docs;
        return Todo.countDocuments({userId: req.userData.userId});
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

exports.getTodo = (req, res, next) => {
    // console.log(req.params.id);
    Todo.findById(req.params.id)
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

exports.updateTodo = (req, res, next) => {
    if (!req.body.updated || !req.body.dateUpdated) {
        return res.status(400).json({message: "Missing required fields"});
    }
    console.log(req.body);
    console.log(req.params.id);
    const todo = new Todo({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        dateUpdated: req.body.dateUpdated,
        updated: req.body.updated,
        imagePath: req.body.imagePath,
        userId: req.userData.userId
    });
    Todo.updateOne({_id: req.params.id}, todo)
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

exports.deleteTodo = (req, res, next) => {
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
