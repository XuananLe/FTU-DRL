// pages/EventsSchedule.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonNote, IonIcon, IonBadge
} from "@ionic/react";
import {
  timeOutline, businessOutline, pinOutline, globeOutline
} from "ionicons/icons";
import ChatbotLogo from "../components/ChatbotLogo";
import "./EventsSchedule.css";

type EventItem = {
  id: string;
  title: string;
  datetime: string;
  org: string;
  location: string;
  online?: boolean;
};

const events: EventItem[] = [
  { id: "1", title: "Hội thảo CLB",        datetime: "02/10 19:00", org: "Câu lạc bộ FTU",      location: "Hội trường A" },
  { id: "2", title: "Workshop Start-up",   datetime: "04/10 18:00", org: "Trung tâm Khởi nghiệp", location: "Online", online: true },
  { id: "3", title: "FTU Marathon",        datetime: "07/10 08:00", org: "Đoàn thanh niên FTU", location: "Sân vận động" },
];

export default function EventsSchedule() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab3" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Lịch sự kiện</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="events-card">
          <div className="events-card__head">
            <div className="head-title">Sự kiện đã đăng ký</div>
            <div className="head-sub">Các sự kiện bạn đã tham gia</div>
          </div>

          <IonList className="events-list">
            {events.map((ev) => (
              <IonItem
                key={ev.id}
                lines="full"
                button
                detail={true}                            // mũi tên mặc định
                routerLink={`/tabs/events/${ev.id}`}
              >
                <IonLabel className="event-label">
                  <div className="event-title">
                    {ev.title}
                    {ev.online && <IonBadge className="badge-soft">Online</IonBadge>}
                  </div>

                  <div className="event-meta">
                    <span className="meta-row">
                      <IonIcon icon={timeOutline} />
                      <IonNote>{ev.datetime}</IonNote>
                    </span>
                    <span className="meta-row">
                      <IonIcon icon={businessOutline} />
                      <IonNote>{ev.org}</IonNote>
                    </span>
                    <span className="meta-row">
                      <IonIcon icon={ev.online ? globeOutline : pinOutline} />
                      <IonNote>{ev.location}</IonNote>
                    </span>
                  </div>
                </IonLabel>

                {/* ĐÃ BỎ IonIcon chevronForward để tránh 2 mũi tên */}
              </IonItem>
            ))}
          </IonList>
        </div>
        
        <ChatbotLogo 
          position="bottom-right" 
          size="small"
        />
      </IonContent>
    </IonPage>
  );
}
