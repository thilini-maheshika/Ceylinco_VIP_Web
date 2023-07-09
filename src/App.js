import "antd/dist/antd.css";
import { Redirect, Route, Switch } from "react-router-dom";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Main from "./components/layout/Main";
import Home from "./pages/dashboard/Home";
import User from "./pages/user/User";
import SignIn from "./pages/auth/SignIn";
import NotFoundPage from "./pages/other/NotFoundPage";
import Policy from "./pages/policy/Policy";


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/404" exact component={NotFoundPage} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path ="/user" component={User} />
          <Route exact path="/" component={Home} />
          <Route exact path="/policy" component={Policy}/>
          {/* <Redirect from="*" to="/" /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;
