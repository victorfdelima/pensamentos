const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thougts', 'root', '82384580vV!', {
    host: '127.0.0.1',
    dialect: 'mysql',
    socketPath: '/var/run/mysqld/mysqld.sock'

})
 try {
     sequelize.authenticate()
     console.log('Conectamos com sucesso')
 } catch (err) {
     console.log(`Não foi possível conectar`, err)
 }

module.exports = sequelize