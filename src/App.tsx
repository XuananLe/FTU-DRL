import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import TabsShell from "./pages/TabsShell";
import AdminDashboard from "./pages/AdminDashboard";

export default function App(){
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" render={() => <Redirect to="/auth" />} />
        <Route exact path="/auth" component={Auth} />
        <Route path="/tabs" component={TabsShell} />
        <Route path="/dashboard" component={AdminDashboard} />
      </IonReactRouter>
    </IonApp>
  );
}
