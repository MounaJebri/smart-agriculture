
const { User } = require('./user.model');
const { Node } = require('./node.model');
const { List } = require('./list.model');
const { Task } = require('./task.model');
const { Sensornode } = require('./sensornode.model');
const { Tanknode } = require('./tanknode.model');
const { Gatewaynode } = require('./gatewaynode.model');


module.exports = {
    User,
    List,
    Task,
    Node,
    Tanknode,
    Sensornode,
    Gatewaynode
}