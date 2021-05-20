const { AuthenticationError, UserInputError } = require("apollo-server");

const Task = require("../../mock-up/Task");
const checkAuth = require("../../helpers/check-auth");
const User = require("../../mock-up/User");

module.exports = {
  Query: {
    async getTasks() {
      try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return tasks;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTask(_, { taskId }) {
      try {
        const task = await Task.findById(taskId);
        if (task) {
          return task;
        } else {
          throw new Error("Task not found Please enter the correct taskID");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createTask(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Task body must not be empty");
      }

      const newTask = new Task({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const task = await newTask.save();

      context.pubsub.publish("NEW_TASK", {
        newTask: task,
      });

      return task;
    },
    async deleteTask(_, { taskId }, context) {
      const user = checkAuth(context);

      try {
        const task = await Task.findById(taskId);
        if (!task) return new Error("Task does not exist")
        if (task.user != user.id) return new Error("you are not allowed ")
        await task.delete();
        return "Task deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
    async updateTask(_, { taskId, body }, context) {
      const user = checkAuth(context);
      try {
        const task = await Task.findById(taskId)
        if (!task) return new Error("Task does not exist")
        if (task.user != user.id) return new Error("you are not allowed ")
        task.body = body
        await task.save()
        return task
      } catch (err) {
        throw new Error(err);
      }
      return task;
    },
    async shareTask(_, { taskId, userId }, context) {
      const connectedUser = checkAuth(context);
      try {
        const task = await Task.findById(taskId)
        if (!task) return new Error("Task does not exist")
        const user = await User.findById(userId)
        if (!user) return new Error("User does not exist")
        if (task.user != connectedUser.id) return new Error("you are not allowed ")
        if (userId == connectedUser.id) return new Error("You are already the owner")
        task.sharedWith.push(userId)
        user.sharedTasks.push(taskId)
        await task.save()
        await user.save()
        return task
      } catch (err) {
        throw new Error(err);
      }
      return task;
    },
    async doneTask(_, { taskId }, context) {
      const user = checkAuth(context);
      const task = await Task.findById(taskId);
      if (!task) return new Error("Task does not exist")
      if (task.user != user.id) return new Error("you are not allowed ")
      task.done = !task.done
      await task.save();
      return task;
    },
  },
  Subscription: {
    newTask: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_TASK"),
    },
  },
};
