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
import Dealer from "./pages/dealer/Dealer";
import Payment from "./pages/payment/paymentMain";
import SinglePolicy from "./pages/policy/SinglePolicy";
import Company from "./pages/company/Company";
import Account from "./pages/profile/Account";
import { ToastContainer } from "react-toastify";


function App() {

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Add a higher z-index value to ensure it appears on top
      />
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/404" exact component={NotFoundPage} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/user" component={User} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/" component={Home} />
          <Route exact path="/policy" component={Policy} />
          <Route exact path="/dealer" component={Dealer} />
          <Route exact path="/company" component={Company} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/single-policy/:id" component={SinglePolicy} />
          {/* <Redirect from="*" to="/" /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;
