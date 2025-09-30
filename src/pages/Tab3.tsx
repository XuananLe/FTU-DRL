import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import {
  timeOutline,
  settingsOutline,
  documentLockOutline,
  informationCircleOutline,
  logOutOutline,
} from "ionicons/icons";
import "./Tab3.css";

export default function Tab3() {
  return (
    <IonPage>
      {/* Header đỏ cong + search */}
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Thông tin cá nhân</IonTitle>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
          <IonSearchbar className="zone-search" placeholder="Tìm kiếm" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Khối thông tin người dùng */}
        <div className="section-head">Thông tin cá nhân</div>

        <IonCard className="profile-card soft">
          <IonCardContent>
            <div className="avatar big" />
            <div className="info">
              <div className="name">Nguyễn Văn A</div>
              <div className="meta">MSSV: 123456</div>
              <div className="meta">Lớp: K60CLC</div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Danh sách action dạng pill */}
        <div className="list-wrap">
          <IonItem button detail className="pill-item">
            <IonIcon slot="start" icon={timeOutline} />
            <IonLabel>Lịch sử check-in</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item">
            <IonIcon slot="start" icon={settingsOutline} />
            <IonLabel>Cài đặt</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item">
            <IonIcon slot="start" icon={documentLockOutline} />
            <IonLabel>Điều khoản sử dụng</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item">
            <IonIcon slot="start" icon={documentLockOutline} />
            <IonLabel>Chính sách bảo vệ dữ liệu cá nhân</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item">
            <IonIcon slot="start" icon={informationCircleOutline} />
            <IonLabel>Thông tin ứng dụng</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item danger">
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Đăng xuất</IonLabel>
          </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
}
