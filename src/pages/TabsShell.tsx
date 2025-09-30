import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import { home, star, qrCode, time, person } from "ionicons/icons";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import ClubQR from "./ClubQR";

export default function TabsShell(){
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={Tab1} />
        <Route exact path="/tabs/favorite" component={Tab2} />
        <Route exact path="/tabs/qr" component={ClubQR} />
        <Route exact path="/tabs/recent" component={Tab2} />
        <Route exact path="/tabs/profile" component={Tab3} />
        {/* default cho /tabs */}
        <Route exact path="/tabs" render={() => <Redirect to="/tabs/home" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home"><IonIcon icon={home}/><IonLabel>Trang chủ</IonLabel></IonTabButton>
        <IonTabButton tab="favorite" href="/tabs/favorite"><IonIcon icon={star}/><IonLabel>Yêu thích</IonLabel></IonTabButton>
        <IonTabButton tab="qr" href="/tabs/qr"><IonIcon icon={qrCode}/><IonLabel>Quét QR</IonLabel></IonTabButton>
        <IonTabButton tab="recent" href="/tabs/recent"><IonIcon icon={time}/><IonLabel>Gần đây</IonLabel></IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile"><IonIcon icon={person}/><IonLabel>Profile</IonLabel></IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
