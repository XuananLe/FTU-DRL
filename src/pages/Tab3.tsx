import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton
} from "@ionic/react";
import {
  personCircleOutline,
  bookOutline,
  calendarOutline,
  documentTextOutline,
  settingsOutline,
  logOutOutline,
} from "ionicons/icons";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import "./Tab3.css";
import { useIonRouter } from "@ionic/react";

export default function Tab3() {
  const router = useIonRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth", "root", "replace");
  };

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

        <IonCard className="profile-card soft" routerLink="/tabs/rl-assessment">
          <IonCardContent>
            <div className="avatar big" />
            <div className="info">
              <div className="name">Vuong Anh</div>
              <div className="meta">MSSV: 2311510018</div>
              <div className="meta">Lớp: Anh  01 - K62 - KDQT</div>
            </div>
          </IonCardContent>
        </IonCard>
        
        {/* Danh sách action dạng pill */}
        <div className="list-wrap">
          <IonItem button detail className="pill-item" routerLink="/tabs/account-security">
            <IonIcon slot="start" icon={personCircleOutline} />
            <IonLabel>Tài khoản và bảo mật</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item" routerLink="/tabs/calendar">
            <IonIcon slot="start" icon={bookOutline} />
            <IonLabel>Lịch học</IonLabel>
          </IonItem>
          <IonItem button detail className="pill-item" routerLink="/tabs/event-schedule">
            <IonIcon slot="start" icon={calendarOutline} />
            <IonLabel>Lịch sự kiện</IonLabel>
          </IonItem>
          <IonItem button detail className="pill-item" routerLink="/tabs/terms">
            <IonIcon slot="start" icon={documentTextOutline} />
            <IonLabel>Điều khoản sử dụng</IonLabel>
          </IonItem>

          <IonItem button detail className="pill-item" routerLink="/tabs/settings">
            <IonIcon slot="start" icon={settingsOutline} />
            <IonLabel>Cài đặt</IonLabel>
          </IonItem>
          <IonItem button detail className="pill-item danger" onClick={handleLogout}>
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Đăng xuất</IonLabel>
          </IonItem>

    <IonCard className="pill-card">
      <IonCardHeader className="ion-no-padding ion-padding-top">
        <IonCardTitle className="app-title">Thông tin ứng dụng</IonCardTitle>
      </IonCardHeader>                                

      <IonCardContent>
        <ul className="app-info-list">
          <li><b>Tên ứng dụng:</b> Zone57</li>
          <li><b>Nhà phát triển:</b> Unicare</li>
          <li><b>Email:</b> k62.2311510018@ftu.edu.vn</li>
          <li><b>SĐT:</b> 0949540626</li>
          <li><b>Phát hành:</b> 10/10/2025</li>                           
          <li><b>Truy cập:</b> https://zone57.edu.vn</li>
        </ul>                                                                                                       

      <div className="app-actions">
        <IonButton
          className="app-btn outline-danger"
          fill="outline"
          color="danger"
          routerLink="/tabs/feedback"           
        >
          Gửi ý kiến phản hồi
        </IonButton>

        <IonButton className="app-btn solid-danger" color="danger">
          Cập nhật phiên bản
        </IonButton>
      </div>
      </IonCardContent>
    </IonCard>


        </div>
      </IonContent>
    </IonPage>
  );
}
