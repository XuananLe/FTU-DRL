import {
  IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel
} from "@ionic/react";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  home, qrCode, person, newspaper, mail
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
        <Switch>
          {/* student pages */}
          <Route path="/tabs/home" component={Tab1} />
          <Route path="/tabs/profile" component={Tab3} />
          <Route path="/tabs/terms" component={TermsOfUse} />
          <Route path="/tabs/feedback" component={FeedbackPage} />
          <Route path="/tabs/event-schedule" component={EventsSchedule} />
          <Route path="/tabs/settings" component={SettingsPage} />
          <Route path="/tabs/calendar" component={CalendarPage} />
          <Route path="/tabs/account-security/change-password" component={ChangePassword} />
          <Route path="/tabs/account-security" component={AccountSecurity} />
          <Route path="/tabs/rl-assessment/form" component={RLAssessmentForm} />
          <Route path="/tabs/rl-assessment" component={RLAssessment} />

          {/* shared: QR conditional by role */}
          <Route
            path="/tabs/qr"
            component={role === "clb" ? ClubQR : ScanCheckin}
          />

          {/* club pages */}
          <Route path="/tabs/clb/dashboard" component={ClubProfile} />
          <Route path="/tabs/clb/feed" component={ClubFeed} />
          <Route path="/tabs/clb/mail" component={ClubMail} />

          {/* default redirect for /tabs */}
          <Route
            exact
            path="/tabs"
            render={() => (
              <Redirect
                to={role === "clb" ? "/tabs/clb/dashboard" : "/tabs/home"}
              />
            )}
          />
        </Switch>
      </IonRouterOutlet>

      {/* TAB BAR */}
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
