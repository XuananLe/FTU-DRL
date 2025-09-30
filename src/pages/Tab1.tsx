import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel, IonAvatar, IonBadge
} from "@ionic/react";
import "./Tab1.css";

function DRLCard({ score, status }: { score: number; status: string }) {
  const pct = Math.max(0, Math.min(score, 100));
  return (
    <div className="drl-card">
      <div className="drl-head">
        <span>ĐRL học kỳ</span>
        <IonBadge color="success" className="drl-status">{status}</IonBadge>
      </div>

      <div className="drl-row">
        <div className="drl-left">
          <div className="goal-title">Mục tiêu kỳ này</div>
          <div className="goal-progress">
            <div className="bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="goal-note">Đã hoàn thành {pct}%</div>
        </div>
        <div className="drl-right">
          <div className="score-ring"><span>{score}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Tab1(){
  const events = [
    {
      title: "Tọa đàm: “Vươn tầm lộ trình nghề nghiệp: Vẽ đường đi tới ước mơ”",
      info: [
        "Thời gian: <b>18h - 20h</b>",
        "Ngày: <b>29/09/2025</b>",
        "Địa điểm: <b>D201</b>",
        "<span class='muted'>2 DRL mục 1.1</span>",
      ],
      state: "ok", // Đã đăng ký
    },
    {
      title: "Chung kết VNYLT - FTU ROUND",
      info: [
        "Thời gian: <b>18h00</b>",
        "Ngày: <b>27/09/2025</b>",
        "Địa điểm: <b>D201</b>",
        "<span class='muted'>2 DRL mục 3.1</span>",
      ],
      state: "link", // » Xem chi tiết
    },
    {
      title: "MINI IDEATHON: DESIGN THINKING",
      info: [
        "Thời gian: <b>7h30 – 11h30</b>",
        "Ngày: <b>20/09/2025</b>",
        "Địa điểm: <b>phòng A8B JAPI, nhà D</b>",
        "<span class='muted'>2 DRL mục 3.1</span>",
      ],
      state: "warn", // Đã tham gia
    },
  ];

  return (
    <IonPage>
      {/* Header đỏ bo cong + search bar riêng: đúng pattern Header chứa nhiều Toolbar */}
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Zone57</IonTitle>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
          <IonSearchbar className="zone-search" placeholder="Tìm kiếm" inputmode="search" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <DRLCard score={88} status="Tốt" />

        <h2 className="section-title">Sự kiện sắp diễn ra</h2>

        <IonList className="event-list">
          {events.map((e, i) => (
            <IonItem key={i} lines="full" className="event-item">
              <IonAvatar slot="start" className="event-avatar">
                <img src={`https://picsum.photos/seed/zone57-${i}/100`} alt="event" />
              </IonAvatar>
              <IonLabel>
                <h3 className="event-title">{e.title}</h3>
                {e.info.map((t, j) => (
                  <p key={j} className="event-meta" dangerouslySetInnerHTML={{ __html: t }} />
                ))}
                {e.state === "ok"   && <p className="event-state ok">• Đã đăng ký</p>}
                {e.state === "warn" && <p className="event-state warn">• Đã tham gia</p>}
                {e.state === "link" && <p className="event-state link">» Xem chi tiết</p>}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
