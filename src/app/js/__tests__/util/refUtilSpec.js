

describe('refUtil', () => {
  it.skip('should foo', () => {
    // Arrange
    const ref = {

    };

    const state = {
      model: {
        children: [refs]
      }
    };

    // Act
    // Assert
  });

  it.only('should create a ref correctly.', () => {
    // Arrange
    const foo = '';

    const state = {
      model: {
        children: [foo]
      }
    };

    const bar = ['bat', 'cat', 'dog', 'mouse'];

    const threeLetterAnimals = bar.map((item) => {
      if (item.length === 3) {
        return item;
      }
    }).filter((item) => item);

    c.lo(threeLetterAnimals);

    // Act
    // Assert
  });
});
