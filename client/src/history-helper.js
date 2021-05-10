import { createBrowserHistory as createHistory } from "history";

const history = createHistory();

history.listen((location, action) => {
  window.scrollTo(0, 0);
});
export default history;
