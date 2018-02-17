import sequelize from 'sequelize';

const Foo = sequelize.define('foo', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});