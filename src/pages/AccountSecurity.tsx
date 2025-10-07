// pages/AccountSecurity.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonNote, IonIcon
} from "@ionic/react";
import { checkmarkCircle, chevronForward } from "ionicons/icons";
import "./AccountSecurity.css";

export default function AccountSecurity() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab3" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Tài khoản và bảo mật</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="section-title">Tài khoản</div>

        <IonList className="card-like">
          <IonItem lines="full">
            <IonLabel>
              <div className="item-title">Số điện thoại</div>
              <IonNote className="muted">(+84) 949 540 626</IonNote>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" button detail={true} routerLink="/account-security/email">
            <IonLabel>
              <div className="item-title">Email</div>
              <IonNote className="muted">k62.2311510018@ftu.edu.vn</IonNote>
            </IonLabel>
          </IonItem>

          <IonItem lines="none">
            <IonLabel>
              <div className="item-title">Định danh tài khoản</div>
              <IonNote color="success">Đã định danh</IonNote>
            </IonLabel>
            <IonIcon slot="end" color="success" icon={checkmarkCircle} />
          </IonItem>
        </IonList>

        <div className="section-title">Bảo mật</div>

        <IonList className="card-like">
          <IonItem button detail={true} routerLink="/tabs/account-security/change-password">
            <IonLabel>
              <div className="item-title">Đổi mật khẩu</div>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
