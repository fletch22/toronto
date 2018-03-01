
class ModelsFactory {
    constructor() {
        this.c1 = sequelize.define('c1', {
            f1: VARCHAR(255),
            f2: VARCHAR(255)
        });
    }
}

export default new ModelsFactory();
