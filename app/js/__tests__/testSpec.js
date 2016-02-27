import AppContainerData from '../sampleData/appContainer';

describe('Calculator', () => {
  it('should add two numbers', () => {
    console.log(AppContainerData);

    expect(AppContainerData.apps.length).toBe(0);
  });
});
