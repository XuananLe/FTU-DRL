import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import { home, star, qrCode, time, person } from "ionicons/icons";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import ScanCheckin from "./ScanCheckin"; // quét & check-in (học sinh)
import ClubQR from "./ClubQR";           // tạo & tải QR (CLB)
import AccountSecurity from "./AccountSecurity";
import ChangePassword from "./ChangePassword";
import EventsSchedule from "./EventsSchedule";
import TermsOfUse from "./TermsOfUse";
import RLAssessment from "./RLAssessment";
import SettingsPage from "./SettingsPage";
import CalendarPage from "./CalendarPage";
import RLAssessmentForm from "./RLAssessmentForm";
export default function TabsShell(){
  const role = (localStorage.getItem('role') || 'sinhvien').toLowerCase();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={Tab1} />
        <Route exact path="/tabs/favorite" component={Tab2} />

        <Route
          exact
          path="/tabs/qr"
          render={() => (role === 'clb' ? <ClubQR/> : <ScanCheckin/>)}
        />
        <Route exact path="/tabs/account-security" component={AccountSecurity} />
        <Route exact path="/tabs/recent" component={Tab2} />
        <Route exact path="/tabs/profile" component={Tab3} />
        <Route exact path="/tabs/terms" component={TermsOfUse} />
        <Route exact path="/tabs/event-schedule" component={EventsSchedule} />
        <Route exact path="/tabs/settings" component={SettingsPage} />
        <Route exact path="/tabs/calendar" component={CalendarPage} />
        <Route exact path="/tabs/account-security/change-password" component={ChangePassword} />
        <Route exact path="/tabs/rl-assessment" component={RLAssessment} />
        <Route exact path="/tabs/rl-assessment/form" component={RLAssessmentForm} />
        <Route exact path="/tabs" render={() => <Redirect to="/tabs/home" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home}/><IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorite" href="/tabs/favorite">
          <IonIcon icon={star}/><IonLabel>Yêu thích</IonLabel>
        </IonTabButton>
        <IonTabButton tab="qr" href="/tabs/qr">
          <IonIcon icon={qrCode}/>
          <IonLabel>{role === 'clb' ? 'Tạo QR' : 'Quét QR'}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="recent" href="/tabs/recent">
          <IonIcon icon={time}/><IonLabel>Gần đây</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={person}/><IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
