import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  useIonRouter,
} from "@ionic/react";
import {
  shareOutline,
  createOutline,
  chevronForwardOutline,
  chevronBackOutline,
  arrowUpOutline,
  arrowDownOutline,
  star,
  starOutline,
  starHalfOutline,
  logOutOutline,
} from "ionicons/icons";
import ChatbotLogo from "../components/ChatbotLogo";
import "./club-profile.css";

// ===== Types =====
type Member = { name: string; role: string };
type DepartmentMembers = { [key: string]: Member[] };

type Event = { date: string; day: string; title: string };

type MonthlyAttendance = { month: string; current: number; previous: number };

type TopMember = { name: string; points: number; trend: number };

type EventRating = {
  name: string;
  participationRate: number; // %
  rating: number; // out of 5
};

type DepartmentStats = { name: string; members: number; percentage: number };

type ActivityHeatmap = { day: number; intensity: number }; // 0-5

export default function ClubProfile() {
  const router = useIonRouter();

  // Tabs
  const [tab, setTab] = useState<"members" | "events" | "stats">("members");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Sign out confirm
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Data
  const events: Event[] = [
    { date: "12/10", day: "", title: "Workshop..." },
    { date: "23/01", day: "", title: "Hội thảo..." },
    { date: "19/03", day: "", title: "Tọa đàm..." },
    { date: "28/05", day: "", title: "Chung kết..." },
  ];

  const departmentMembers: DepartmentMembers = {
    "Ban chủ nhiệm": [
      { name: "Đặng Ngọc Hiền Nhi", role: "Chủ tịch" },
      { name: "Ngô Đặng Phương Linh", role: "Phó Chủ tịch" },
    ],
    "Ban chuyên môn": [
      { name: "Vũ Tiến Hiển", role: "Trưởng ban" },
      { name: "Vũ Tiến Hiển", role: "Phó ban" },
      { name: "Vũ Tiến Hiển", role: "Thành viên" },
      { name: "Vũ Tiến Hiển", role: "Thành viên" },
    ],
    "Ban đối ngoại": [
      { name: "Vũ Tiến Hiển", role: "Trưởng ban" },
      { name: "Vũ Tiến Hiển", role: "Phó ban" },
      { name: "Vũ Tiến Hiển", role: "Thành viên" },
    ],
    "Ban tổ chức": [
      { name: "Vũ Tiến Hiển", role: "Trưởng ban" },
      { name: "Vũ Tiến Hiển", role: "Phó ban" },
      { name: "Vũ Tiến Hiển", role: "Thành viên" },
      { name: "Vũ Tiến Hiển", role: "Thành viên" },
    ],
    "Ban truyền thông": [
      { name: "Thắng Ngọt", role: "Trưởng ban" },
      { name: "Your holiday boyfriend", role: "Phó ban" },
      { name: "Mãi yêu FTU", role: "Thành viên" },
    ],
  };

  const clubStats = {
    totalMembers: 48,
    totalEvents: 24,
    totalHours: 189,
    newMembers: 12,
    attendance: 87,
    memberGrowth: 18,
    retentionRate: 92,
    femalePercentage: 62,
    malePercentage: 38,
  };

  const monthlyAttendance: MonthlyAttendance[] = [
    { month: "T1", current: 85, previous: 72 },
    { month: "T2", current: 78, previous: 65 },
    { month: "T3", current: 92, previous: 80 },
    { month: "T4", current: 88, previous: 84 },
    { month: "T5", current: 75, previous: 70 },
    { month: "T6", current: 82, previous: 74 },
  ];

  const topMembers: TopMember[] = [
    { name: "Nguyễn Văn A", points: 456, trend: 12 },
    { name: "Trần Thị B", points: 412, trend: 8 },
    { name: "Lê Hoàng C", points: 389, trend: -3 },
    { name: "Phạm Minh D", points: 356, trend: 15 },
    { name: "Hoàng Thị E", points: 342, trend: 5 },
  ];

  const eventRatings: EventRating[] = [
    { name: "Hội thảo nghề nghiệp 2025", participationRate: 95, rating: 4.8 },
    { name: "Workshop kỹ năng mềm", participationRate: 86, rating: 4.5 },
    { name: "Tọa đàm khởi nghiệp", participationRate: 92, rating: 4.7 },
    { name: "Cuộc thi Tài năng trẻ", participationRate: 78, rating: 4.3 },
    { name: "Tiệc chào tân sinh viên", participationRate: 97, rating: 4.9 },
  ];

  const departmentStats: DepartmentStats[] = [
    { name: "Ban chủ nhiệm", members: 5, percentage: 10.4 },
    { name: "Ban chuyên môn", members: 12, percentage: 25 },
    { name: "Ban đối ngoại", members: 8, percentage: 16.7 },
    { name: "Ban tổ chức", members: 13, percentage: 27.1 },
    { name: "Ban truyền thông", members: 10, percentage: 20.8 },
  ];

  const activityHeatmap: ActivityHeatmap[] = Array.from(
    { length: 28 },
    (_, i) => ({
      day: i + 1,
      intensity: Math.floor(Math.random() * 6),
    })
  );

  const [statsTab, setStatsTab] = useState<
    "attendance" | "events" | "members" | "analytics"
  >("attendance");

  const handleSignOut = () => {
    // Clear auth if needed:
    // localStorage.removeItem("auth_token");
    router.push("/auth", "root", "replace");
  };

  const renderStarRating = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<IonIcon key={i} icon={star} />);
      else if (i === full && half) stars.push(<IonIcon key={i} icon={starHalfOutline} />);
      else stars.push(<IonIcon key={i} icon={starOutline} />);
    }
    return stars;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">CLB Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Profile Card */}
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonCard className="cp-card">
                <IonCardContent>
                  <div className="cp-card-content">
                    <div className="cp-avatar" />
                    <div className="cp-info">
                      <div className="cp-name">CLB Kinh doanh Quốc tế - IBC FTU</div>
                      <div className="cp-handle">@ibc.ftu</div>

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

                      {/* Sign out */}
                      <IonButton
                        expand="block"
                        color="danger"
                        className="cp-btn solid-danger"
                        onClick={() => setShowSignOutConfirm(true)}
                      >
                        <IonIcon icon={logOutOutline} slot="start" />
                        Đăng xuất
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Tabs */}
        <IonGrid>
          <IonRow>
            <IonCol size="12">
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
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Members */}
        {tab === "members" && !selectedDept && (
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonCard>
                  <IonCardContent>
                    <div className="cp-list">
                      {[
                        "Ban chủ nhiệm",
                        "Ban chuyên môn",
                        "Ban đối ngoại",
                        "Ban tổ chức",
                        "Ban truyền thông",
                      ].map((label) => (
                        <button
                          key={label}
                          className="cp-list-item"
                          onClick={() => setSelectedDept(label)}
                        >
                          <span>{label}</span>
                          <IonIcon icon={chevronForwardOutline} />
                        </button>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {tab === "members" && selectedDept && (
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonCard>
                  <IonCardHeader>
                    <div className="cp-dept-header">
                      <button className="cp-back-button" onClick={() => setSelectedDept(null)}>
                        <IonIcon icon={chevronBackOutline} />
                      </button>
                      <IonCardTitle className="cp-dept-title">{selectedDept}</IonCardTitle>
                      <div style={{ width: 20 }} />
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="cp-member-list">
                      {departmentMembers[selectedDept]?.map((member, i) => (
                        <div key={i} className="cp-member-item">
                          <div className="cp-member-avatar" />
                          <div className="cp-member-info">
                            <div className="cp-member-name">{member.name}</div>
                            <div className="cp-member-role">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* Events */}
        {tab === "events" && (
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle className="cp-events-year">Sự kiện 2025</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="cp-timeline">
                      <div className="cp-timeline-line" />
                      {events.map((event, i) => (
                        <div key={i} className="cp-timeline-item">
                          <div className="cp-timeline-date">{event.date}</div>
                          <div className="cp-timeline-dot" />
                          <div className="cp-timeline-content">
                            <span className="cp-event-title">{event.title}</span>
                            <IonIcon icon={chevronForwardOutline} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* Stats */}
        {tab === "stats" && (
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="cp-stats-container">
            <div className="cp-stats-header">
              <div className="cp-stats-title">Tổng quan hoạt động</div>
              <div className="cp-stats-info">
                <div className="cp-stats-item">
                  <div className="cp-stats-label">Tổng thành viên</div>
                  <div className="cp-stats-value">{clubStats.totalMembers}</div>
                  <div className="cp-trend-indicator positive">
                    <IonIcon icon={arrowUpOutline} /> {clubStats.memberGrowth}%
                  </div>
                </div>
                <div className="cp-stats-item">
                  <div className="cp-stats-label">Sự kiện</div>
                  <div className="cp-stats-value">{clubStats.totalEvents}</div>
                </div>
                <div className="cp-stats-item">
                  <div className="cp-stats-label">Giờ hoạt động</div>
                  <div className="cp-stats-value">{clubStats.totalHours}</div>
                </div>
                <div className="cp-stats-item">
                  <div className="cp-stats-label">Thành viên mới</div>
                  <div className="cp-stats-value">+{clubStats.newMembers}</div>
                </div>
              </div>
            </div>

            <div className="cp-stats-tabs">
              <button
                className={`cp-stats-tab ${statsTab === "attendance" ? "active" : ""}`}
                onClick={() => setStatsTab("attendance")}
              >
                Điểm danh
              </button>
              <button
                className={`cp-stats-tab ${statsTab === "events" ? "active" : ""}`}
                onClick={() => setStatsTab("events")}
              >
                Sự kiện
              </button>
              <button
                className={`cp-stats-tab ${statsTab === "members" ? "active" : ""}`}
                onClick={() => setStatsTab("members")}
              >
                Thành viên
              </button>
              <button
                className={`cp-stats-tab ${statsTab === "analytics" ? "active" : ""}`}
                onClick={() => setStatsTab("analytics")}
              >
                Phân tích
              </button>
            </div>

            {statsTab === "attendance" && (
              <>
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Tỷ lệ điểm danh theo tháng</div>
                  <div className="cp-stats-chart">
                    <div className="cp-chart-grid">
                      <div className="cp-chart-grid-line percent-25"></div>
                      <div className="cp-chart-grid-line percent-50"></div>
                      <div className="cp-chart-grid-line percent-75"></div>

                      <div className="cp-chart-grid-label percent-0">0%</div>
                      <div className="cp-chart-grid-label percent-25">25%</div>
                      <div className="cp-chart-grid-label percent-50">50%</div>
                      <div className="cp-chart-grid-label percent-75">75%</div>
                      <div className="cp-chart-grid-label percent-100">100%</div>
                    </div>

                    <div className="cp-chart-bar-container">
                      {monthlyAttendance.map((item, index) => (
                        <div key={index} className="cp-chart-bar" style={{ height: "100%" }}>
                          <div
                            className="cp-chart-bar-inner"
                            style={{ height: `${item.current}%` }}
                          />
                          <div
                            className="cp-chart-bar-inner secondary"
                            style={{ height: `${item.previous}%`, width: "60%", left: "20%", opacity: 0.8 }}
                          />
                          <div className="cp-chart-label">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cp-chart-legend">
                    <div className="cp-chart-legend-item">
                      <div className="cp-chart-legend-color primary" />
                      <span>Năm nay</span>
                    </div>
                    <div className="cp-chart-legend-item">
                      <div className="cp-chart-legend-color secondary" />
                      <span>Năm trước</span>
                    </div>
                  </div>
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Lịch sử điểm danh (28 ngày gần đây)</div>
                  <div className="cp-heatmap">
                    {activityHeatmap.map((day) => (
                      <div
                        key={day.day}
                        className={`cp-heatmap-day cp-heat-${day.intensity}`}
                        title={`Ngày ${day.day}: ${day.intensity * 20}% tham gia`}
                      />
                    ))}
                  </div>
                </div>

                <div className="cp-analytics-grid">
                  <div className="cp-analytics-card">
                    <div className="cp-stats-label">Tỷ lệ điểm danh trung bình</div>
                    <div className="cp-stats-value">{clubStats.attendance}%</div>
                    <div className="cp-trend-indicator positive">
                      <IonIcon icon={arrowUpOutline} /> 5.2% so với tháng trước
                    </div>
                  </div>
                  <div className="cp-analytics-card">
                    <div className="cp-stats-label">Tỷ lệ duy trì thành viên</div>
                    <div className="cp-stats-value">{clubStats.retentionRate}%</div>
                    <div className="cp-trend-indicator positive">
                      <IonIcon icon={arrowUpOutline} /> 2.7% so với kỳ trước
                    </div>
                  </div>
                </div>
              </>
            )}

            {statsTab === "events" && (
              <>
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Lượt tham gia sự kiện</div>

                  {eventRatings.map((e, index) => (
                    <div key={index} className="cp-event-rating-item">
                      <div>
                        <div className="cp-event-rating-name">{e.name}</div>
                        <div className="cp-event-rating-bar-container">
                          <div
                            className="cp-event-rating-bar"
                            style={{ width: `${e.participationRate}%` }}
                          />
                        </div>
                      </div>
                      <div className="cp-event-rating-stars">
                        {renderStarRating(e.rating)}
                        <span>{e.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân tích sự kiện</div>
                  <div className="cp-circular-chart-container">
                    <div>
                      <div
                        className="cp-circular-chart"
                        style={{
                          background: `conic-gradient(var(--cp-accent) 0% ${97 * 3.6}deg, #f1d1d1 ${97 * 3.6}deg 360deg)`,
                        }}
                      >
                        <div className="cp-circular-chart-text">97%</div>
                      </div>
                      <div className="cp-circular-chart-label">Tỷ lệ tham gia cao nhất</div>
                    </div>
                    <div>
                      <div
                        className="cp-circular-chart"
                        style={{
                          background: `conic-gradient(var(--cp-accent) 0% ${89.6 * 3.6}deg, #f1d1d1 ${89.6 * 3.6}deg 360deg)`,
                        }}
                      >
                        <div className="cp-circular-chart-text">89.6%</div>
                      </div>
                      <div className="cp-circular-chart-label">Tỷ lệ tham gia trung bình</div>
                    </div>
                  </div>
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Mức độ hài lòng</div>
                  <div className="cp-analytics-grid">
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Sự kiện được đánh giá cao nhất</div>
                      <div className="cp-stats-value">4.9/5</div>
                      <div
                        className="cp-event-rating-stars"
                        style={{ justifyContent: "flex-start", marginTop: 4 }}
                      >
                        {renderStarRating(4.9)}
                      </div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Đánh giá trung bình</div>
                      <div className="cp-stats-value">4.6/5</div>
                      <div
                        className="cp-event-rating-stars"
                        style={{ justifyContent: "flex-start", marginTop: 4 }}
                      >
                        {renderStarRating(4.6)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {statsTab === "members" && (
              <>
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân bổ thành viên theo ban</div>
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="cp-event-rating-item">
                      <div>
                        <div className="cp-event-rating-name">{dept.name}</div>
                        <div className="cp-event-rating-bar-container">
                          <div
                            className="cp-event-rating-bar"
                            style={{ width: `${dept.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                      <div className="cp-stats-item-value">
                        {dept.members} ({dept.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân bổ giới tính</div>
                  <div className="cp-circular-chart-container">
                    <div>
                      <div
                        className="cp-circular-chart"
                        style={{
                          background: `conic-gradient(var(--cp-accent) 0% ${
                            clubStats.femalePercentage * 3.6
                          }deg, #f1d1d1 ${clubStats.femalePercentage * 3.6}deg 360deg)`,
                        }}
                      >
                        <div className="cp-circular-chart-text">
                          {clubStats.femalePercentage}%
                        </div>
                      </div>
                      <div className="cp-circular-chart-label">Nữ</div>
                    </div>
                    <div>
                      <div
                        className="cp-circular-chart"
                        style={{
                          background: `conic-gradient(#f1d1d1 0% ${
                            clubStats.malePercentage * 3.6
                          }deg, var(--cp-accent) ${
                            clubStats.malePercentage * 3.6
                          }deg 360deg)`,
                        }}
                      >
                        <div className="cp-circular-chart-text">
                          {clubStats.malePercentage}%
                        </div>
                      </div>
                      <div className="cp-circular-chart-label">Nam</div>
                    </div>
                  </div>
                </div>

                <div className="cp-stats-list">
                  <div className="cp-stats-list-title">Thành viên hoạt động tích cực</div>
                  {topMembers.map((m, index) => (
                    <div key={index} className="cp-stats-list-item">
                      <div className="cp-stats-item-name">{m.name}</div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="cp-stats-item-value">{m.points} điểm</div>
                        <div
                          className={`cp-trend-indicator ${
                            m.trend >= 0 ? "positive" : "negative"
                          }`}
                          style={{ marginLeft: 8 }}
                        >
                          <IonIcon icon={m.trend >= 0 ? arrowUpOutline : arrowDownOutline} />
                          {Math.abs(m.trend)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {statsTab === "analytics" && (
              <>
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân tích tổng hợp</div>
                  <div className="cp-analytics-grid">
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Tỷ lệ tăng trưởng</div>
                      <div className="cp-stats-value">+{clubStats.memberGrowth}%</div>
                      <div className="cp-trend-indicator positive">
                        <IonIcon icon={arrowUpOutline} /> So với kỳ trước
                      </div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Tỷ lệ duy trì</div>
                      <div className="cp-stats-value">{clubStats.retentionRate}%</div>
                      <div className="cp-trend-indicator positive">
                        <IonIcon icon={arrowUpOutline} /> 2.7% so với năm trước
                      </div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Điểm trung bình/thành viên</div>
                      <div className="cp-stats-value">315</div>
                      <div className="cp-trend-indicator positive">
                        <IonIcon icon={arrowUpOutline} /> 15 điểm so với kỳ trước
                      </div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Tỷ lệ hoạt động tích cực</div>
                      <div className="cp-stats-value">78%</div>
                      <div className="cp-trend-indicator positive">
                        <IonIcon icon={arrowUpOutline} /> 4.3% so với tháng trước
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phát triển thành viên qua thời gian</div>
                  <div
                    style={{
                      height: 140,
                      background: "#f9f9f9",
                      borderRadius: 8,
                      margin: "16px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: 14,
                    }}
                  >
                    Biểu đồ tăng trưởng thành viên
                  </div>
                </div>

                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Chỉ số thành công chính</div>
                  <div className="cp-analytics-grid">
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Tỷ lệ giữ chân thành viên mới</div>
                      <div className="cp-stats-value">87%</div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Thời lượng trung bình/sự kiện</div>
                      <div className="cp-stats-value">3.2 giờ</div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Hiệu quả điểm danh</div>
                      <div className="cp-stats-value">93%</div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Mức độ hài lòng chung</div>
                      <div className="cp-stats-value">4.7/5</div>
                    </div>
                  </div>
                </div>
              </>
            )}
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>

      <IonAlert
        isOpen={showSignOutConfirm}
        header="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        buttons={[
          { text: "Hủy", role: "cancel", handler: () => setShowSignOutConfirm(false) },
          { text: "Đăng xuất", role: "destructive", handler: handleSignOut },
        ]}
        onDidDismiss={() => setShowSignOutConfirm(false)}
      />
      
      <ChatbotLogo 
        position="bottom-right" 
        size="small"
      />
    </IonPage>
  );
}
