import Sequelize from 'sequelize';


class DatabaseService {
  constructor() {
    this.sequelize = new Sequelize('mysql', 'root', 'rumgen999', {
      host: 'localhost',
      dialect: 'mysql',

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  // constructor() {
  //   this.sequelize = new Sequelize('sakila', 'root', 'rumgen999', {
  //     host: 'localhost',
  //     dialect: 'mysql',
  //
  //     pool: {
  //       max: 5,
  //       min: 0,
  //       acquire: 30000,
  //       idle: 10000
  //     }
  //   });
  // }

  getTest() {
    // this.sequelize
    //   .query(
    //     'SELECT * FROM actor WHERE last_name = :lastName',
    //     { raw: true, replacements: { lastName: 'WAHLBERG' } }
    //   )
    //   .then(projects => {
    //     console.log(projects);
    //   });
  }
}

export default new DatabaseService();


