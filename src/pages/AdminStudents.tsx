import React from "react";
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import { EventTrackingDashboard } from "../components/EventTrackingDashboard";

export default function AdminStudents(){
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Quản lý Sinh viên & Theo dõi Sự kiện</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <EventTrackingDashboard />
      
      <div className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tính năng bổ sung</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="card-pad">
            Tính năng tìm kiếm MSSV, xem lịch sử DRL (demo chưa bật)
          </IonCardContent>
        </IonCard>
      </div>
    </>
  );
}
