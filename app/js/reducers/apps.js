const apps = (state = { apps: [] }, action) => {
  console.log(JSON.stringify(state));

  switch (action.type) {
    case 'ADD_APP': {
      const stateNew = Object.assign({}, state);

      console.log(stateNew.apps.length);

      stateNew.apps.push(`App #${stateNew.apps.length}`);

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default apps;
