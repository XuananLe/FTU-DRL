import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonIcon, IonButton
} from "@ionic/react";
import { idCardOutline, lockClosedOutline, timeOutline } from "ionicons/icons";
import "./RLAssessment.css";

export default function RLAssessment() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            {/* Có defaultHref để luôn quay lại Tab3 trong mọi trường hợp */}
            <IonBackButton defaultHref="/tabs/tab3" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Đánh Giá Kết Quả Rèn Luyện</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Card: Thông tin cá nhân */}
        <IonCard className="sheet">
          <div className="sheet-head">
            <IonIcon icon={idCardOutline} />
            <span>THÔNG TIN CÁ NHÂN</span>
          </div>
          <IonCardContent>
            <div className="kv">
              <span>Họ và tên:</span><b>ABCXYZ</b>
            </div>
            <div className="kv">
              <span>Lớp:</span><b>Anh 01 - TC KDQT - K62</b>
            </div>
            <div className="kv">
              <span>MSSV:</span><b>2311510018</b>
            </div>
            <div className="kv">
              <span>Email:</span><b>k62.2311510018@ftu.edu.vn</b>
            </div>
            <div className="kv">
              <span>Điện thoại:</span><b>0949540626</b>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Card: Chức năng chưa mở */}
        <IonCard className="sheet">
          <div className="sheet-head warn">
            <IonIcon icon={lockClosedOutline} />
            <span>Chức năng chưa mở</span>
          </div>
          <IonCardContent>
            <p className="muted">
              Tính năng Đánh giá Rèn luyện chỉ được mở vào cuối kỳ.
              Vui lòng quay lại sau khi kết thúc học kỳ để thực hiện đánh giá.
            </p>

            <IonItem lines="none" className="kv-row">
              <IonIcon slot="start" icon={timeOutline} />
              <IonLabel>
                <div className="kv">
                  <span>Thời gian mở:</span><b>Cuối học kỳ</b>
                </div>
                <div className="kv">
                  <span>Trạng thái:</span><b className="danger">Đã khóa</b>
                </div>
              </IonLabel>
            </IonItem>

            <div className="cta">
            <IonButton color="danger" fill="solid" routerLink="/tabs/rl-assessment/form">
                🚀 Mở kỳ đánh giá
            </IonButton>
            </div>

          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
