import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonFooter, IonTabBar, IonTabButton, IonLabel
} from "@ionic/react";
import { 
  shareOutline, createOutline, chevronForwardOutline, 
  homeOutline, mailOutline, gridOutline, documentTextOutline
} from "ionicons/icons";
import "./club-profile.css";

export default function ClubProfile() {
  const [tab, setTab] = useState<"members" | "events" | "stats">("members");

  return (
    <IonPage>
      {/* Header styling to match design */}
      <IonHeader className="cp-header" translucent={true}>
        <IonToolbar className="cp-toolbar">
          <IonTitle className="cp-title">Hồ sơ CLB</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="cp-content" fullscreen>
        {/* Card hồ sơ */}
        <section className="cp-card">
          <div className="cp-avatar" />
          <div className="cp-info">
            <div className="cp-name">CLB B Trường đại học Ngoại thương - B FTU</div>
            <div className="cp-handle">@b.ftu</div>

            <div className="cp-metrics">
              <div className="cp-metric">
                <span className="cp-metric-value">257</span>
                <span className="cp-metric-label">Người theo dõi</span>
              </div>
              <div className="cp-metric">
                <span className="cp-metric-value">02</span>
                <span className="cp-metric-label">Đang theo dõi</span>
              </div>
            </div>

            <div className="cp-actions">
              <IonButton className="cp-btn ghost" fill="clear">
                <IonIcon icon={createOutline} />
                Chỉnh sửa hồ sơ
              </IonButton>
              <IonButton className="cp-btn ghost" fill="clear">
                <IonIcon icon={shareOutline} />
                Chia sẻ hồ sơ
              </IonButton>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="cp-tabs">
          <button
            className={`cp-tab ${tab === "members" ? "is-active" : ""}`}
            onClick={() => setTab("members")}
          >
            Thành viên
          </button>
          <button
            className={`cp-tab ${tab === "events" ? "is-active" : ""}`}
            onClick={() => setTab("events")}
          >
            Sự kiện
          </button>
          <button
            className={`cp-tab ${tab === "stats" ? "is-active" : ""}`}
            onClick={() => setTab("stats")}
          >
            Thống kê
          </button>
        </nav>

        {/* Content theo tab */}
        {tab === "members" && (
          <div className="cp-list">
            {[
              "Ban chủ nhiệm",
              "Ban chuyên môn",
              "Ban đối ngoại",
              "Ban tổ chức", 
              "Ban truyền thông",
            ].map((label) => (
              <button key={label} className="cp-list-item">
                <span>{label}</span>
                <IonIcon icon={chevronForwardOutline} size="small" />
              </button>
            ))}
          </div>
        )}

        {tab === "events" && (
          <div className="cp-empty">
            <p>Chưa có sự kiện gần đây.</p>
          </div>
        )}

        {tab === "stats" && (
          <div className="cp-empty">
            <p>Biểu đồ thống kê sẽ hiển thị tại đây.</p>
          </div>
        )}
      </IonContent>

    </IonPage>
  );
}
