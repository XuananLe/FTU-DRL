import {
  IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import {
  home, star, qrCode, time, person, newspaper, mail, settings, peopleCircle, calendar
} from "ionicons/icons";

import Tab1 from "./Tab1";
import Tab3 from "./Tab3";
import ScanCheckin from "./ScanCheckin";
import AccountSecurity from "./AccountSecurity";
import ChangePassword from "./ChangePassword";
import EventsSchedule from "./EventsSchedule";
import TermsOfUse from "./TermsOfUse";
import RLAssessment from "./RLAssessment";
import SettingsPage from "./SettingsPage";
import CalendarPage from "./CalendarPage";
import RLAssessmentForm from "./RLAssessmentForm";
import ClubQR from "./ClubQR";
import ClubFeed from "./ClubFeed";
import FeedbackPage from "./Feedback";
import ClubMail from "./ClubMail";
import ClubProfile from "./ClubDashboard";

type TabDef = { tab: string; href: string; icon: any; label: string };

export default function TabsShell() {
  const role = (localStorage.getItem("role") || "sinhvien").toLowerCase();

  // Tabs cấu hình theo role
  const studentTabs: TabDef[] = [
    { tab: "home",     href: "/tabs/home",    icon: home,      label: "Trang chủ" },
    { tab: "qr",       href: "/tabs/qr",      icon: qrCode,    label: "Quét QR" },
    { tab: "profile",  href: "/tabs/profile", icon: person,    label: "Profile" },
  ];

  const clubTabs: TabDef[] = [
    { tab: "dashboard", href: "/tabs/clb/dashboard", icon: home,   label: "Dashboard" },
    { tab: "mail",      href: "/tabs/clb/mail",      icon: mail,   label: "Tin nhắn" },
    { tab: "qr",        href: "/tabs/qr",            icon: qrCode, label: "Tạo QR" },
    { tab: "feed",      href: "/tabs/clb/feed",      icon: newspaper, label: "Bảng tin" },
  ];


  const tabs = role === "clb" ? clubTabs : studentTabs;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home"            component={Tab1} />
        <Route exact path="/tabs/profile"         component={Tab3} />
        <Route exact path="/tabs/terms"           component={TermsOfUse} />
        <Route exact path="/tabs/feedback"        component={FeedbackPage}/>
        <Route exact path="/tabs/event-schedule"  component={EventsSchedule} />
        <Route exact path="/tabs/settings"        component={SettingsPage} />
        <Route exact path="/tabs/calendar"        component={CalendarPage} />
        <Route exact path="/tabs/account-security" component={AccountSecurity} />
        <Route exact path="/tabs/account-security/change-password" component={ChangePassword} />
        <Route exact path="/tabs/rl-assessment"   component={RLAssessment} />
        <Route exact path="/tabs/rl-assessment/form" component={RLAssessmentForm} />

        <Route
          exact
          path="/tabs/qr"
          render={() => (role === "clb" ? <ClubQR /> : <ScanCheckin />)}
        />

        <Route exact path="/tabs/clb/dashboard" component={ClubProfile} />
        <Route exact path="/tabs/clb/feed"      component={ClubFeed} />
        <Route exact path="/tabs/clb/mail" component={ClubMail} />

        {/* Default redirect */}
        <Route exact path="/tabs" render={() => (
          <Redirect to={role === "clb" ? "/tabs/clb/dashboard" : "/tabs/home"} />
        )} />
      </IonRouterOutlet>

      {/* TAB BAR (Ionic requires it under IonTabs) */}
      <IonTabBar slot="bottom">
        {tabs.map(({ tab, href, icon, label }) => (
          <IonTabButton key={tab} tab={tab} href={href}>
            <IonIcon icon={icon} />
            <IonLabel>{label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
}
