const {DataTypes} = require('sequelize')

const db = require('../db/conn');
const User = require('./User')

const Thougt = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },

})

Thougt.belongsTo(User)
User.hasMany(Thougt)

module.exports = Thougt