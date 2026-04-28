const User = require('./User');
const Task = require('./Task');

// One User has Many Tasks
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, Task };
