import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from "@ionic/react";

const clubs = [
  { name: "CLB ACE",       events: 12, students: 420, status: "Active"  },
  { name: "CLB Design",    events:  8, students: 210, status: "Active"  },
  { name: "CLB Tech",      events:  5, students: 150, status: "Pending" },
  { name: "CLB Volunteer", events:  9, students: 310, status: "Active"  },
];

export default function AdminClubs() {
  return (
    <div className="board">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Quản lý CLB <span className="muted">Tổng {clubs.length} CLB</span></IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="card-pad">
          <div className="table">
            <div className="t-head">
              <div>CLB</div><div>Sự kiện</div><div>SV tham gia</div><div>Trạng thái</div><div />
            </div>
            {clubs.map(c => (
              <div className="t-row" key={c.name}>
                <div>{c.name}</div>
                <div>{c.events}</div>
                <div>{c.students}</div>
                <div>{c.status}</div>
                <div><IonButton size="small" fill="outline" color="danger">Xem</IonButton></div>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
