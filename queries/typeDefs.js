const { gql } = require("apollo-server");

module.exports = gql`
  type Task {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    done: Boolean!
    commentCount: Int!
    sharedWith: [User]!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    sharedTasks: [Task]
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getTasks: [Task]
    getTask(taskId: ID!): Task
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createTask(body: String!): Task!
    deleteTask(taskId: ID!): String!
    updateTask(taskId: ID!, body: String!): Task!
    shareTask(taskId: ID!, userId: ID!): Task!
    createComment(taskId: String!, body: String!): Task!
    deleteComment(taskId: ID!, commentId: ID!): Task!
    doneTask(taskId: String!): Task!
  }
  type Subscription {
    newTask: Task!
  }
`;