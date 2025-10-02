import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";

export default function AdminStudents(){
  return (
    <IonCard>
      <IonCardHeader><IonCardTitle>Quản lý Sinh viên</IonCardTitle></IonCardHeader>
      <IonCardContent className="card-pad">
        Tính năng tìm kiếm MSSV, xem lịch sử DRL (demo chưa bật)
      </IonCardContent>
    </IonCard>
  );
}
