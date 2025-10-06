import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Switch, Route, Redirect } from "react-router-dom";

import Auth from "./pages/Auth";
import TabsShell from "./pages/TabsShell";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/auth" />} />
            <Route path="/auth" component={Auth} />
            <Route path="/tabs" component={TabsShell} />
            <Route path="/dashboard" component={AdminDashboard} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
