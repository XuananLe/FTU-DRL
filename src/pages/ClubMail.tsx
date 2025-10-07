import React, { useMemo, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonSearchbar, IonFooter
} from "@ionic/react";
import {
  notificationsOffOutline, homeOutline, mailOutline, scanOutline, personCircleOutline
} from "ionicons/icons";
import "./club-mail.css";

/* ===================== Types ===================== */
type Message = {
  id: number;
  sender: string;
  preview: string;
  time: string;      // "09:12" | "Hôm qua" | "2 ngày trước" ...
  unread?: boolean;
  color?: string;    // avatar dot color
};

/* ===================== Seed data ===================== */
const inboxMessages: Message[] = [
  { id: 1,  sender: "CLB Truyền Thông", preview: "Nhắc lịch họp content tối nay, 19:30 tại A305.", time: "09:12", unread: true,  color: "#8E2B2B" },
  { id: 2,  sender: "Phòng CTSV",      preview: "Thông báo nộp minh chứng DRL đợt 2 trước 12/10.", time: "08:40", unread: true,  color: "#D9D9D9" },
  { id: 3,  sender: "CLB Công Nghệ",   preview: "Hackathon Smart Campus: finalize danh sách đội.", time: "Hôm qua", color: "#BCEBEA" },
  { id: 4,  sender: "FTU Events",      preview: "Ảnh hậu trường Workshop Start-up đã up album.",   time: "Hôm qua", color: "#D6F2C7" },
  { id: 5,  sender: "Anh Minh (Mentor)", preview: "Deck pitch ổn rồi, bổ sung slide KPI tuần 1.", time: "Hôm qua", color: "#EED6E9" },
  { id: 6,  sender: "CLB Tiếng Anh",   preview: "Topic tuần này: Travel stories. Đăng ký slot nhé.", time: "2 ngày trước", color: "#BCEBEA" },
  { id: 7,  sender: "Bạn Lan",         preview: "Tối nay check lại form đăng ký giúp mình với nha.", time: "2 ngày trước", color: "#D9D9D9" },
  { id: 8,  sender: "CLB Tình Nguyện", preview: "Danh sách trực gian hàng Hội trại 20/10.",        time: "3 ngày trước", color: "#D6F2C7" },
  { id: 9,  sender: "CLB Văn Nghệ",    preview: "Casting đợt 2: 18:00 thứ 5, phòng B201.",        time: "3 ngày trước", color: "#8E2B2B" },
  { id: 10, sender: "Thầy Hưng",       preview: "Điểm lab tuần rồi đã cập nhật trên LMS.",        time: "4 ngày trước", color: "#EED6E9" },
  { id: 11, sender: "CLB Thể Thao",    preview: "Lịch đá giao hữu chiều CN tại sân số 2.",        time: "4 ngày trước", color: "#BCEBEA" },
  { id: 12, sender: "Bạn Quân",        preview: "Cho mình logo .svg với file màu chuẩn nhé.",      time: "5 ngày trước", color: "#D9D9D9" },
  { id: 13, sender: "Ban Học Tập",     preview: "Share note KTLT chương con trỏ & bài tập khó.",   time: "5 ngày trước", color: "#D6F2C7" },
  { id: 14, sender: "CLB Sách",        preview: "Book talk: Atomic Habits – đăng ký tham gia.",     time: "6 ngày trước", color: "#BCEBEA" },
  { id: 15, sender: "FTU Career",      preview: "Ngày hội việc làm 2025: danh sách doanh nghiệp.", time: "1 tuần trước", color: "#8E2B2B" },
];

const pendingMessages: Message[] = [
  { id: 101, sender: "Sinh viên A1", preview: "Xin phép tham gia nhóm truyền thông.", time: "09:05", unread: true, color: "#D9D9D9" },
  { id: 102, sender: "Sinh viên B2", preview: "Em apply CTV thiết kế, portfolio đính kèm.", time: "Hôm qua", color: "#8E2B2B" },
  { id: 103, sender: "Sinh viên C3", preview: "Hỏi lịch sinh hoạt CLB tuần này.", time: "2 ngày trước", color: "#BCEBEA" },
];

/* ==================================================== */
export default function ClubMail({ hideLocalFooter = true }: { hideLocalFooter?: boolean }) {
  const [active, setActive] = useState<"inbox" | "pending">("inbox");
  const list = useMemo(() => (active === "inbox" ? inboxMessages : pendingMessages), [active]);

  return (
    <IonPage>
      {/* ===== Header (giữ layout như mockup) ===== */}
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Mail/ Tin nhắn</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" style={{color: 'white'}}>
              <IonIcon icon={notificationsOffOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar className="cm-searchbar-toolbar">
          <IonSearchbar
            placeholder="Tìm kiếm"
            inputMode="search"
            className="cm-searchbar"
            showClearButton="never"
          />
        </IonToolbar>

        {/* Tabs “Hộp thư / Tin nhắn đang chờ” */}
        <IonToolbar className="cm-tabs">
          <div className="cm-tab-row">
            <button
              className={`cm-tab ${active === "inbox" ? "is-active" : ""}`}
              onClick={() => setActive("inbox")}
            >
              Hộp thư
            </button>
            <button
              className={`cm-tab ${active === "pending" ? "is-active" : ""}`}
              onClick={() => setActive("pending")}
            >
              Tin nhắn đang chờ
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* ===== Content ===== */}
      <IonContent className="cm-content ion-padding">
        <div className="cm-list">
          {list.map((m) => (
            <div key={m.id} className={`cm-item ${m.unread ? "is-unread" : ""}`}>
              <span className="cm-avatar" style={{ background: m.color }} />
              <div className="cm-card">
                <div className="cm-line1">
                  <span className="cm-sender">{m.sender}</span>
                  <span className="cm-time">{m.time}</span>
                </div>
                <div className="cm-preview">{m.preview}</div>
              </div>
            </div>
          ))}
        </div>
      </IonContent>

      {/* ===== Bottom bar custom (ẩn mặc định để khỏi trùng IonTabBar) ===== */}
      {!hideLocalFooter && (
        <IonFooter>
          <IonToolbar className="cm-tabbar">
            <div className="cm-tabbar-row">
              <button className="cm-tabbar-btn">
                <IonIcon icon={homeOutline} />
              </button>
              <button className="cm-tabbar-btn is-current">
                <IonIcon icon={mailOutline} />
              </button>
              <button className="cm-tabbar-btn">
                <IonIcon icon={scanOutline} />
              </button>
              <button className="cm-tabbar-btn">
                <IonIcon icon={personCircleOutline} />
              </button>
            </div>
          </IonToolbar>
        </IonFooter>
      )}
    </IonPage>
  );
}
