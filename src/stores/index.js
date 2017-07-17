import AppStore from "./app-store";
const fetcher = url => window.fetch(url).then(response => response.json());

const store = {
  app: new AppStore(fetcher)
};

export default store;

store.app.loadSpecies();
