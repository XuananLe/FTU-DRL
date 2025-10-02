import React, { useState } from "react";
import {
  IonPage, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonMenuToggle, IonLabel, IonRouterOutlet,
  IonButtons, IonButton, IonIcon
} from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { menu as menuIcon, downloadOutline } from "ionicons/icons";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

const MENU = [
  { path: "/admin/dashboard", label: "Dashboard" },
  // placeholder các trang khác (có thể thêm dần)
  { path: "/admin/clubs",     label: "Quản lý CLB" },
  { path: "/admin/students",  label: "Quản lý SV" },
  { path: "/admin/review",    label: "Phê duyệt sự kiện" },
];

export default function AdminShell() {
  const { pathname } = useLocation();
  const [term] = useState("Kỳ học: Hè 2025");

  return (
    <IonPage>
      <IonSplitPane when="lg" contentId="main">
        {/* ===== Sidebar ===== */}
        <IonMenu contentId="main" className="app-menu" side="start" type="overlay">
          <IonContent>
            <div className="menu-header">
              <div className="avatar">ST</div>
              <div className="meta">
                <span className="name">School Admin</span>
                <span className="role">Quản trị hệ thống</span>
              </div>
            </div>

            <IonList className="menu-list">
              {MENU.map(m => (
                <IonMenuToggle key={m.path} autoHide={false}>
                  <IonItem
                    button
                    detail={false}
                    routerLink={m.path}
                    aria-selected={pathname === m.path}
                  >
                    <IonLabel>{m.label}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              ))}
            </IonList>
          </IonContent>
        </IonMenu>

        {/* ===== Main ===== */}
        <div className="ion-page" id="main">
          <IonHeader translucent>
            <IonToolbar className="app-toolbar">
              <IonButtons slot="start">
                <IonButton fill="clear">
                  <IonIcon icon={menuIcon} slot="icon-only" />
                </IonButton>
              </IonButtons>
              <IonTitle>Dashboard</IonTitle>

              <div className="term-badge">{term}</div>

              <div className="header-actions" slot="end">
                <IonButton className="btn" fill="clear">
                  <IonIcon slot="start" icon={downloadOutline}/>
                  Xuất báo cáo
                </IonButton>
              </div>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen>
            <IonRouterOutlet>
              <Route exact path="/admin">
                <Redirect to="/admin/dashboard" />
              </Route>
              <Route exact path="/admin/dashboard" component={AdminDashboard} />
              {/* Các route khác có thể tạo sau */}
              <Route exact path="/admin/clubs" component={AdminDashboard} />
              <Route exact path="/admin/students" component={AdminDashboard} />
              <Route exact path="/admin/review" component={AdminDashboard} />
            </IonRouterOutlet>
          </IonContent>
        </div>
      </IonSplitPane>
    </IonPage>
  );
}
