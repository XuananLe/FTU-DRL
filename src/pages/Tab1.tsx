import React, { useMemo, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonButton, IonModal, IonList, IonItem, IonLabel,
  IonIcon, IonToast
} from "@ionic/react";
import { calendarNumberOutline, locationOutline } from "ionicons/icons";
import ChatbotLogo from "../components/ChatbotLogo";
import "./Tab1.css";

/* ================= DRL Card ================= */
function DRLCard({
  score, status, target = 100, onScoreClick,
}: {
  score: number; status: string; target?: number; onScoreClick?: () => void;
}) {
  const pct = Math.min(100, Math.round((score / target) * 100));

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

        {/* Vòng tròn điểm – click được nhưng giữ nguyên visual */}
        <button
          type="button"
          className="score-ring as-button"
          onClick={onScoreClick}
          aria-label="Gợi ý để đạt mục tiêu"
        >
          <div className="score-number">{score}</div>
        </button>
      </div>
    </div>
  );
}

/* ================= Page ================= */
export default function Tab1() {
  type EventState = "ok" | "register" | "participate" | "link";
  type EventItem = {
    title: string;
    imgSeed?: string;
    info: string[];     // các dòng có HTML đã format
    state: EventState;
    drlText?: string;   // ví dụ: "2 DRL mục 1.1"
  };

  // ==== Helpers ====
  const extractDRL = (e: EventItem) => {
    // Lấy số DRL từ drlText, fallback 2
    const fromText = e.drlText ?? "";
    const m = fromText.match(/(\d+)\s*DRL/i);
    return m ? Number(m[1]) : 2;
  };

  const extractDate = (e: EventItem) => {
    const raw = e.info.find((s) => s.includes("Ngày:"));
    const m = raw?.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return Number.MAX_SAFE_INTEGER;
    const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
    return new Date(y, mo - 1, d).getTime();
  };

  const rankEvents = (list: EventItem[]) =>
    list
      .filter((e) => e.state === "link") // chỉ những event có thể đăng ký
      .sort((a, b) => {
        const byDRL = extractDRL(b) - extractDRL(a);
        if (byDRL !== 0) return byDRL;
        return extractDate(a) - extractDate(b); // sớm hơn trước
      });

  // Tổng DRL theo trạng thái (để tính điểm đã cam kết)
  const sumDRL = (list: EventItem[], states: EventState[]) =>
    list.reduce((s, e) => (states.includes(e.state) ? s + extractDRL(e) : s), 0);

  const pickToReach = (list: EventItem[], missing: number) => {
    const picked: EventItem[] = [];
    let acc = 0;
    for (const e of list) {
      if (acc >= missing) break;
      picked.push(e);
      acc += extractDRL(e);
    }
    return { picked, acc };
  };

  // ==== State ====
  const [events, setEvents] = useState<EventItem[]>([
    {
      title: 'Tọa đàm: "Vươn tầm lộ trình nghề nghiệp: Vẽ đường đi tới ước mơ"',
      imgSeed: "event-1",
      info: [
        "Thời gian: <b>18h - 20h</b>",
        "Ngày: <b>29/09/2025</b>",
        "Địa điểm: <b>D201</b>",
        "Thời gian mở đơn: <b>20/9-27/9</b>",
        "Yêu cầu: <b>tham dự trên 80%</b>",
      ],
      state: "link",
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
      ],
      state: "link",
      drlText: "2 DRL mục 3.1",
    },
    {
      title: "Workshop: CV chuẩn - Kỹ năng vàng",
      imgSeed: "event-3",
      info: [
        "Thời gian: <b>18h00 - 20h</b>",
        "Ngày: <b>25/09/2025</b>",
        "Địa điểm: <b>A1001</b>",
        "Yêu cầu: <b>không có</b>",
      ],
      state: "link",
      drlText: "2 DRL mục 3.1",
    },
    {
      title: "MINI IDEATHON: DESIGN THINKING",
      imgSeed: "event-4",
      info: [
        "Thời gian: <b>7h30 - 11h30</b>",
        "Ngày: <b>20/09/2025</b>",
        "Địa điểm: <b>phòng A8B JAPI, nhà D</b>",
        "Thời gian mở đơn: <b>18/9/2025</b>",
      ],
      state: "link",
      drlText: "2 DRL mục 3.1",
    },
  ]);

  const [showSuggest, setShowSuggest] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });

  // ====== Math chuẩn xác ======
  const score = 70;
  const target = 100;

  // Thiếu hiện tại (theo điểm thực có)
  const currentMissing = Math.max(0, target - score);

  // Điểm DRL đã "cam kết" từ những event user đã đăng ký (register)
  const futureCommitted = useMemo(() => sumDRL(events, ["register"]), [events]);

  // Thiếu dự kiến sau khi tính các đăng ký hiện có
  const projectedMissing = Math.max(0, currentMissing - futureCommitted);

  // Gợi ý dựa trên thiếu dự kiến
  const ranked = useMemo(() => rankEvents(events), [events]);
  const needForPick = projectedMissing || 1; // nếu đủ rồi, vẫn gợi ý nhẹ 1 event
  const { picked, acc } = useMemo(() => pickToReach(ranked, needForPick), [ranked, needForPick]);

  // Còn thiếu sau khi nhận bộ gợi ý hiện tại
  const remain = Math.max(0, projectedMissing - acc);

  const handleRegister = (idx: number) => {
    setEvents((prev) => {
      const next = prev.map((e, i) => (i === idx ? { ...e, state: "register" as EventState } : e));
      // Tính lại thiếu dự kiến mới sau khi đăng ký xong
      const committed = sumDRL(next, ["register"]);
      const projMissing = Math.max(0, Math.max(0, target - score) - committed);
      setToast({
        open: true,
        msg: `Đã đăng ký sự kiện. Còn thiếu ~${projMissing} điểm để đạt mục tiêu.`,
      });
      return next;
    });
  };

  // Status style mapping (đồng bộ màu)
  const statusClass = (state: EventState) =>
    state === "register" || state === "ok"
      ? "event-status event-status--registered"
      : state === "participate"
      ? "event-status event-status--participated"
      : "event-status event-status--link";

  const statusText = (state: EventState) =>
    state === "register" || state === "ok"
      ? ">> Đã đăng ký"
      : state === "participate"
      ? "• Đã tham gia"
      : ">> Xem chi tiết";

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
        <DRLCard
          score={score}
          status="Khá"
          target={target}
          onScoreClick={() => setShowSuggest(true)}
        />

        <h2 className="section-title">Sự kiện sắp diễn ra</h2>

        <div className="event-list flex flex-col gap-2">
          {events.map((e, i) => (
            <div key={i} className="event-container">
              <div className="event-item compact flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FFF6E9] px-3 py-2 shadow-sm w-full max-w-full">
                {/* Poster */}
                <div className="shrink-0 event-img">
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
                      {e.info.slice(0, 4).map((t, j) => (
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
                        <div className={statusClass(e.state)}>{statusText(e.state)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========= Modal Gợi ý ========= */}
        <IonModal
          isOpen={showSuggest}
          className="suggest-modal"
          onDidDismiss={() => setShowSuggest(false)}
          initialBreakpoint={0.6}
          breakpoints={[0, 0.6, 0.9]}
        >
          <div className="suggest-wrapper">
            <div className="suggest-head">
              <div className="suggest-title">Gợi ý để đạt mục tiêu</div>
              <div className="suggest-sub">
                Thiếu hiện tại: <b>{currentMissing}</b> điểm.
                {futureCommitted > 0 && (
                  <> (sau đăng ký hiện có: còn <b>{projectedMissing}</b> điểm)</>
                )}
              </div>
            </div>

            <div className="suggest-chip-row">
              <span className="chip">Đang mở đăng ký</span>
              <span className="chip">Ưu tiên DRL cao</span>
            </div>

            <IonList lines="none">
              {picked.map((ev) => {
                const idx = events.indexOf(ev);
                return (
                  <IonItem key={idx} className="suggest-item">
                    <img
                      className="suggest-thumb"
                      src={`/assets/events/${ev.imgSeed || `event-${idx + 1}`}.jpg`}
                      alt=""
                    />
                    <IonLabel className="suggest-label">
                      <div className="suggest-title-item">{ev.title}</div>
                      <div className="suggest-meta">
                        <IonIcon icon={calendarNumberOutline} />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ev.info.find((s) => s.includes("Ngày:")) || "",
                          }}
                        />
                      </div>
                      <div className="suggest-meta">
                        <IonIcon icon={locationOutline} />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ev.info.find((s) => s.includes("Địa điểm:")) || "",
                          }}
                        />
                      </div>
                      <div className="suggest-drl">
                        {ev.drlText ?? `+${extractDRL(ev)} DRL`}
                      </div>
                    </IonLabel>

                    {ev.state === "link" ? (
                      <IonButton size="small" color="success" onClick={() => handleRegister(idx)}>
                        Đăng ký (+{extractDRL(ev)} DRL)
                      </IonButton>
                    ) : (
                      <IonButton size="small" fill="outline" disabled>
                        Đã đăng ký
                      </IonButton>
                    )}
                  </IonItem>
                );
              })}
            </IonList>

            <div className="suggest-foot">
              {remain > 0 ? (
                <div className="remain">
                  Còn thiếu <b>{remain}</b> điểm (sau khi tính đăng ký hiện có)
                  {acc > 0 && <> — bộ gợi ý này bổ sung <b>{acc}</b> điểm</>}.
                </div>
              ) : (
                <div className="remain ok">
                  Tuyệt! Bộ gợi ý hiện tại là đủ để bạn chạm mục tiêu.
                </div>
              )}
              <IonButton expand="block" onClick={() => setShowSuggest(false)}>
                Đóng
              </IonButton>
            </div>
          </div>
        </IonModal>

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          duration={1600}
          onDidDismiss={() => setToast({ open: false, msg: "" })}
        />
        
        <ChatbotLogo 
          position="bottom-right" 
          size="small" 
          onClick={() => setShowSuggest(true)}
        />
      </IonContent>
    </IonPage>
  );
}
