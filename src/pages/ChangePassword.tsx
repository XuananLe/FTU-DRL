import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonButton
} from "@ionic/react";
import "./AccountSecurity.css";

export default function ChangePassword() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/account-security" text="" /></IonButtons>
          <IonTitle className="zone-title">Đổi mật khẩu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList className="card-like">
          <IonItem>
            <IonLabel position="stacked">Mật khẩu hiện tại</IonLabel>
            <IonInput type="password" placeholder="••••••••" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Mật khẩu mới</IonLabel>
            <IonInput type="password" placeholder="••••••••" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Nhập lại mật khẩu mới</IonLabel>
            <IonInput type="password" placeholder="••••••••" />
          </IonItem>
        </IonList>

        <IonButton expand="block" color="danger" className="ion-margin-top">
          Lưu thay đổi
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
