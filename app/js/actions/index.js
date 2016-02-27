export const addApp = (app) => {
  console.log(JSON.stringify(app));
  return {
    type: 'ADD_APP',
    text: 'test'
  };
};

