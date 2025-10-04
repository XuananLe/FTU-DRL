import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel, IonIcon, IonBadge, IonButton, IonText
} from "@ionic/react";
import "./Tab1.css";

function DRLCard({ score, status, target = 100 }: { score: number; status: string; target?: number }) {
  const pct = Math.min(100, Math.round((score / target) * 100));
  const statusColor =
    status === "Xuất sắc" ? "success" :
      status === "Tốt" ? "success" :
        status === "Khá" ? "warning" : "medium";

  return (
    <div className="drl-card">
      <div className="drl-head">
        <div className="drl-title">ĐRL học kỳ</div>
        <div className={`status-badge ${status === "Khá" ? "kha" : ""}`}>• {status}</div>
      </div>

      <div className="drl-row">
        <div className="drl-left">
          <div className="goal-title">Mục tiêu kỳ này</div>
          <div className="goal-meta">Mục tiêu: {target} | Hiện tại: {score}</div>
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

export default function Tab1() {
  type EventState = "ok" | "register" | "participate" | "link";
  type EventItem = {
    title: string;
    imgSeed?: string;
    info: string[];           // lines with <b>value</b> already formatted
    state: EventState;
    drlText?: string;         // e.g. "2 DRL mục 1.1"
  };

  const events: EventItem[] = [
    {
      title: "Tọa đàm: \"Vươn tầm lộ trình nghề nghiệp: Vẽ đường đi tới ước mơ\"",
      imgSeed: "event-1",
      info: [
        "Thời gian: <b>18h - 20h</b>",
        "Ngày: <b>29/09/2025</b>",
        "Địa điểm: <b>D201</b>",
        "Thời gian mở đơn: <b>20/9-27/9</b>",
        "Yêu cầu: <b>tham dự trên 80%</b>",
      ],
      state: "ok", // Đã đăng ký
      drlText: "2 DRL mục 1.1",
    },
    {
      title: "Chung kết VNYLT - FTU ROUND",
      imgSeed: "event-2",
      info: [
        "Thời gian: <b>18h00</b>",
        "Ngày: <b>27/09/2025</b>",
        "Địa điểm: <b>D201</b>",
        "Thời gian mở đơn: <b>22/9-26/9</b>",
        "Yêu cầu: <b>tham dự trên 80%</b>",
        "<span class='muted'>2 DRL mục 3.1</span>",
      ],
      state: "link", // » Xem chi tiết
    },
    {
      title: "Workshop: CV chuẩn - Kỹ năng vàng",
      imgSeed: "event-3",
      info: [
        "Thời gian: <b>18h00 - 20h</b>",
        "Ngày: <b>25/09/2025</b>",
        "Địa điểm: <b>A1001</b>",
        "Yêu cầu: <b>không có</b>",
        "<span class='muted'>2 DRL mục 3.1</span>",
      ],
      state: "register", // Đã đăng ký
    },
    {
      title: "MINI IDEATHON: DESIGN THINKING",
      imgSeed: "event-4",
      info: [
        "Thời gian: <b>7h30 - 11h30</b>",
        "Ngày: <b>20/09/2025</b>",
        "Địa điểm: <b>phòng A8B JAPI, nhà D</b>",
        "Thời gian mở đơn: <b>18/9/2025</b>",
        "<span class='muted'>2 DRL mục 3.1</span>",
      ],
      state: "participate", // Đã tham gia
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Zone57</IonTitle>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
          <IonSearchbar className="zone-search" placeholder="Tìm kiếm" inputmode="search" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="tab1-content">
        <DRLCard score={70} status="Khá" target={100} />

        <h2 className="section-title">Sự kiện sắp diễn ra</h2>


        <div className="event-list flex flex-col gap-2">
          {events.map((e, i) => (
            <div key={i} className="event-container">
              <div
                className="
          event-item compact
          flex items-center gap-3
          rounded-2xl border border-gray-200 bg-[#FFF6E9]
          px-3 py-2 shadow-sm
          w-full max-w-full               /* responsive width */
        "
              >
                {/* Poster */}
                <div className="shrink-0">
                  <img
                    className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
                    src={`/assets/events/${e.imgSeed || `event-${i + 1}`}.jpg`}
                    alt="event"
                  />
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-[14px] font-extrabold leading-tight text-[#1E4F79]">
                    {e.title}
                  </div>

                  <div className="mt-2 bg-[#fbf3ea] border border-[#f0e4db] rounded-lg px-3 py-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-y-0.5">
                      {e.info.slice(0, 4).map((t: string, j: number) => (
                        <div
                          key={j}
                          className="event-meta col-span-2 grid grid-cols-[auto_1fr] items-center"
                          dangerouslySetInnerHTML={{ __html: t }}
                        />
                      ))}

                      <div className="col-span-2 mt-1.5 pt-1 border-t border-[#f0e4db] flex items-center justify-between">
                        <div className="text-[12px] font-semibold text-[#C41F1F]">
                          {e.drlText ?? "2 DRL mục 1.1"}
                        </div>

                        {e.state === "ok" && (
                          <div className="text-[12px] font-semibold text-[#1A8F3A]">
                            <span className="text-[#1A8F3A] font-semibold">{">> "}</span>
                            Đã đăng ký
                          </div>
                        )}
                        {e.state === "register" && (
                          <div className="text-[12px] font-medium text-amber-700">
                            <span className="mr-0.5">•</span>
                            Đã đăng ký
                          </div>
                        )}
                        {e.state === "participate" && (
                          <div className="text-[12px] font-medium text-rose-700">
                            <span className="mr-0.5">•</span>
                            Đã tham gia
                          </div>
                        )}
                        {e.state === "link" && (
                          <div className="text-[12px] font-semibold text-[#0C4FB3]">
                            <span className="text-[#0C4FB3] font-semibold">{">> "}</span>
                            Xem chi tiết
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </IonContent>
    </IonPage>
  );
}
