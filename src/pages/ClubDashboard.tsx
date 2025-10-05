import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonFooter, IonTabBar, IonTabButton, IonLabel, IonBackButton
} from "@ionic/react";
import { 
  shareOutline, createOutline, chevronForwardOutline, 
  homeOutline, mailOutline, gridOutline, documentTextOutline,
  chevronBackOutline, peopleOutline, calendarOutline, timeOutline, 
  personAddOutline, arrowUpOutline, trendingUpOutline,
  star, starOutline, starHalfOutline
} from "ionicons/icons";
import "./club-profile.css";

// Define types for members
type Member = {
  name: string;
  role: string;
};

type DepartmentMembers = {
  [key: string]: Member[];
};

// Define types for events
type Event = {
  date: string;
  day: string;
  title: string;
};

// Define types for statistics
type MonthlyAttendance = {
  month: string;
  percentage: number;
  height: number;
};

type TopMember = {
  name: string;
  points: number;
};

type EventRating = {
  name: string;
  participationRate: number; // As percentage
  rating: number; // Rating out of 5
};

export default function ClubProfile() {
  // Use Ionic navigation history for back button
  const defaultBackHref = "/";
  
  // Helper function to render star ratings
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<IonIcon key={i} icon={star} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<IonIcon key={i} icon={starHalfOutline} />);
      } else {
        stars.push(<IonIcon key={i} icon={starOutline} />);
      }
    }
    
    return stars;
  };
  // Default to members tab as shown in the screenshot
  const [tab, setTab] = useState<"members" | "events" | "stats">("members");
  // Add state for the currently selected department
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  
  // Sample events data for the timeline
  const events: Event[] = [
    { date: "12/10", day: "", title: "Workshop..." },
    { date: "23/01", day: "", title: "Hội thảo..." },
    { date: "19/03", day: "", title: "Tọa đàm..." },
    { date: "28/05", day: "", title: "Chung kết..." },
  ];
  
  // Sample member data for each department
  const departmentMembers: DepartmentMembers = {
    "Ban chủ nhiệm": [
      { name: "Tên ai đó :))))", role: "Chủ tịch" },
      { name: "Tên ai đó :))))", role: "Phó Chủ tịch" },
      { name: "Tên ai đó :))))", role: "Phó Chủ tịch" },
    ],
    "Ban chuyên môn": [
      { name: "Tên ai đó :))))", role: "Trưởng ban" },
      { name: "Tên ai đó :))))", role: "Phó ban" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
    ],
    "Ban đối ngoại": [
      { name: "Tên ai đó :))))", role: "Trưởng ban" },
      { name: "Tên ai đó :))))", role: "Phó ban" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
    ],
    "Ban tổ chức": [
      { name: "Tên ai đó :))))", role: "Trưởng ban" },
      { name: "Tên ai đó :))))", role: "Phó ban" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
    ],
    "Ban truyền thông": [
      { name: "Tên ai đó :))))", role: "Trưởng ban" },
      { name: "Tên ai đó :))))", role: "Phó ban" },
      { name: "Tên ai đó :))))", role: "Thành viên" },
    ],
  };
  
  // Sample data for statistics
  const clubStats = {
    totalMembers: 48,
    totalEvents: 24,
    totalHours: 189,
    newMembers: 12,
    attendance: 87,
  };
  
  // Monthly attendance data
  const monthlyAttendance: MonthlyAttendance[] = [
    { month: "T1", percentage: 85, height: 85 },
    { month: "T2", percentage: 78, height: 78 },
    { month: "T3", percentage: 92, height: 92 },
    { month: "T4", percentage: 88, height: 88 },
    { month: "T5", percentage: 75, height: 75 },
    { month: "T6", percentage: 82, height: 82 }
  ];
  
  // Top members data
  const topMembers: TopMember[] = [
    { name: "Nguyễn Văn A", points: 456 },
    { name: "Trần Thị B", points: 412 },
    { name: "Lê Hoàng C", points: 389 },
    { name: "Phạm Minh D", points: 356 },
    { name: "Hoàng Thị E", points: 342 }
  ];
  
  // Event rating data
  const eventRatings: EventRating[] = [
    { name: "Hội thảo nghề nghiệp 2025", participationRate: 95, rating: 4.8 },
    { name: "Workshop kỹ năng mềm", participationRate: 86, rating: 4.5 },
    { name: "Tọa đàm khởi nghiệp", participationRate: 92, rating: 4.7 },
    { name: "Cuộc thi Tài năng trẻ", participationRate: 78, rating: 4.3 },
    { name: "Tiệc chào tân sinh viên", participationRate: 97, rating: 4.9 }
  ];
  
  // For stats tab navigation
  const [statsTab, setStatsTab] = useState<"attendance" | "events">("attendance");

  return (
    <IonPage>
      
      <IonContent className="cp-content">
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

        {/* Content theo tab - exactly matching design */}
        {tab === "members" && !selectedDept && (
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
        )}
        
        {/* Department member details view */}
        {tab === "members" && selectedDept && (
          <div>
            <div className="cp-dept-header">
              <button className="cp-back-button" onClick={() => setSelectedDept(null)}>
                <IonIcon icon={chevronBackOutline} />
              </button>
              <h2 className="cp-dept-title">{selectedDept}</h2>
              <div style={{ width: "20px" }}></div> {/* Spacer for alignment */}
            </div>
            
            <div className="cp-member-list">
              {departmentMembers[selectedDept].map((member, index) => (
                <div key={index} className="cp-member-item">
                  <div className="cp-member-avatar">
                    {/* Empty avatar icon similar to the screenshot */}
                  </div>
                  <div className="cp-member-info">
                    <div className="cp-member-name">{member.name}</div>
                    <div className="cp-member-role">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "events" && (
          <>
            <h2 className="cp-events-year">2025</h2>
            <div className="cp-timeline">
              <div className="cp-timeline-line"></div>
              {events.map((event, index) => (
                <div key={index} className="cp-timeline-item">
                  <div className="cp-timeline-date">{event.date}</div>
                  <div className="cp-timeline-dot"></div>
                  <div className="cp-timeline-content">
                    <span className="cp-event-title">{event.title}</span>
                    <IonIcon icon={chevronForwardOutline} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "stats" && (
          <div className="cp-stats-container">
            {/* Overview stats */}
            <div className="cp-stats-header">
              <div className="cp-stats-title">Tổng quan hoạt động</div>
              <div className="cp-stats-info">
                <div className="cp-stats-item">
                  <div className="cp-stats-label">Tổng thành viên</div>
                  <div className="cp-stats-value">{clubStats.totalMembers}</div>
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
            
            {/* Stats navigation tabs */}
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
            </div>

            {statsTab === "attendance" && (
              <>
                {/* Attendance chart */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Tỷ lệ tham gia (6 tháng gần đây)</div>
                  <div className="cp-stats-chart">
                    <div className="cp-chart-bar-container">
                      {monthlyAttendance.map((item, index) => (
                        <div key={index} className="cp-chart-bar" style={{ height: '100%' }}>
                          <div 
                            className="cp-chart-bar-inner" 
                            style={{ height: `${item.height}%` }}
                          ></div>
                          <div className="cp-chart-label">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Current attendance rate */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Tỷ lệ điểm danh hiện tại</div>
                  <div className="cp-circular-chart">
                    <div className="cp-circular-chart-text">{clubStats.attendance}%</div>
                  </div>
                </div>

                {/* Top members list */}
                <div className="cp-stats-list">
                  <div className="cp-stats-list-title">Thành viên hoạt động tích cực</div>
                  {topMembers.map((member, index) => (
                    <div key={index} className="cp-stats-list-item">
                      <div className="cp-stats-item-name">{member.name}</div>
                      <div className="cp-stats-item-value">{member.points} điểm</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {statsTab === "events" && (
              <>
                {/* Event ratings */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Lượt tham gia sự kiện</div>
                  
                  {eventRatings.map((event, index) => (
                    <div key={index} className="cp-event-rating-item">
                      <div>
                        <div className="cp-event-rating-name">{event.name}</div>
                        <div className="cp-event-rating-bar-container">
                          <div 
                            className="cp-event-rating-bar" 
                            style={{ width: `${event.participationRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="cp-event-rating-stars">
                        {renderStarRating(event.rating)}
                        <span>{event.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Participation summary */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Tỷ lệ tham gia sự kiện</div>
                  <div className="cp-stats-info" style={{marginTop: '12px'}}>
                    <div className="cp-stats-item">
                      <div className="cp-stats-label">Sự kiện có tỷ lệ tham gia cao nhất</div>
                      <div className="cp-stats-value">97%</div>
                    </div>
                    <div className="cp-stats-item">
                      <div className="cp-stats-label">Tỷ lệ tham gia trung bình</div>
                      <div className="cp-stats-value">89%</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </IonContent>

      {/* Footer shelf for iOS safe area */}
      <div className="cp-footer-shelf"></div>
    </IonPage>
  );
}
