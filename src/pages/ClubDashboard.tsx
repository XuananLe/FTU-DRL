import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonFooter, IonTabBar, IonTabButton, IonLabel, IonBackButton
} from "@ionic/react";
import { 
  shareOutline, createOutline, chevronForwardOutline, 
  homeOutline, mailOutline, gridOutline, documentTextOutline,
  chevronBackOutline, peopleOutline, calendarOutline, timeOutline, 
  personAddOutline, arrowUpOutline, arrowDownOutline, trendingUpOutline,
  star, starOutline, starHalfOutline, statsChart, analyticsOutline,
  barChartOutline, pieChartOutline, timeOutline as clockOutline
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
  current: number;
  previous: number;
};

type TopMember = {
  name: string;
  points: number;
  trend: number; // Percentage change
};

type EventRating = {
  name: string;
  participationRate: number; // As percentage
  rating: number; // Rating out of 5
};

type DepartmentStats = {
  name: string;
  members: number;
  percentage: number;
};

type ActivityHeatmap = {
  day: number;
  intensity: number; // 0-5 scale
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
    memberGrowth: 18, // % growth
    retentionRate: 92,
    femalePercentage: 62,
    malePercentage: 38
  };
  
  // Monthly attendance data - compare current vs previous year
  const monthlyAttendance: MonthlyAttendance[] = [
    { month: "T1", current: 85, previous: 72 },
    { month: "T2", current: 78, previous: 65 },
    { month: "T3", current: 92, previous: 80 },
    { month: "T4", current: 88, previous: 84 },
    { month: "T5", current: 75, previous: 70 },
    { month: "T6", current: 82, previous: 74 }
  ];
  
  // Top members data with trend
  const topMembers: TopMember[] = [
    { name: "Nguyễn Văn A", points: 456, trend: 12 },
    { name: "Trần Thị B", points: 412, trend: 8 },
    { name: "Lê Hoàng C", points: 389, trend: -3 },
    { name: "Phạm Minh D", points: 356, trend: 15 },
    { name: "Hoàng Thị E", points: 342, trend: 5 }
  ];
  
  // Event rating data
  const eventRatings: EventRating[] = [
    { name: "Hội thảo nghề nghiệp 2025", participationRate: 95, rating: 4.8 },
    { name: "Workshop kỹ năng mềm", participationRate: 86, rating: 4.5 },
    { name: "Tọa đàm khởi nghiệp", participationRate: 92, rating: 4.7 },
    { name: "Cuộc thi Tài năng trẻ", participationRate: 78, rating: 4.3 },
    { name: "Tiệc chào tân sinh viên", participationRate: 97, rating: 4.9 }
  ];
  
  // Department breakdown
  const departmentStats: DepartmentStats[] = [
    { name: "Ban chủ nhiệm", members: 5, percentage: 10.4 },
    { name: "Ban chuyên môn", members: 12, percentage: 25 },
    { name: "Ban đối ngoại", members: 8, percentage: 16.7 },
    { name: "Ban tổ chức", members: 13, percentage: 27.1 },
    { name: "Ban truyền thông", members: 10, percentage: 20.8 }
  ];
  
  // Activity heatmap - last 28 days
  const activityHeatmap: ActivityHeatmap[] = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: Math.floor(Math.random() * 6) // Random intensity 0-5
  }));
  
  // For stats tab navigation
  const [statsTab, setStatsTab] = useState<"attendance" | "events" | "members" | "analytics">("attendance");

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
                {/* Attendance chart - advanced with comparison */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Tỷ lệ điểm danh theo tháng</div>
                  <div className="cp-stats-chart">
                    {/* Grid lines */}
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
                        <div key={index} className="cp-chart-bar" style={{ height: '100%' }}>
                          {/* Current year bar */}
                          <div 
                            className="cp-chart-bar-inner" 
                            style={{ height: `${item.current}%` }}
                          ></div>
                          
                          {/* Previous year bar - slightly offset */}
                          <div 
                            className="cp-chart-bar-inner secondary" 
                            style={{ 
                              height: `${item.previous}%`, 
                              width: '60%', 
                              left: '20%',
                              opacity: 0.8
                            }}
                          ></div>
                          
                          <div className="cp-chart-label">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="cp-chart-legend">
                    <div className="cp-chart-legend-item">
                      <div className="cp-chart-legend-color primary"></div>
                      <span>Năm nay</span>
                    </div>
                    <div className="cp-chart-legend-item">
                      <div className="cp-chart-legend-color secondary"></div>
                      <span>Năm trước</span>
                    </div>
                  </div>
                </div>
                
                {/* Activity heatmap - show activity patterns by day */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Lịch sử điểm danh (28 ngày gần đây)</div>
                  <div className="cp-heatmap">
                    {activityHeatmap.map((day, index) => (
                      <div 
                        key={index} 
                        className={`cp-heatmap-day cp-heat-${day.intensity}`}
                        title={`Ngày ${day.day}: ${day.intensity * 20}% tham gia`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Advanced attendance metrics */}
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
                {/* Event ratings - improved with more data */}
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
                
                {/* Event comparison */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân tích sự kiện</div>
                  <div className="cp-circular-chart-container">
                    <div>
                      <div className="cp-circular-chart" style={{
                        background: `conic-gradient(var(--cp-accent) 0% ${97 * 3.6}deg, #f1d1d1 ${97 * 3.6}deg 360deg)`
                      }}>
                        <div className="cp-circular-chart-text">97%</div>
                      </div>
                      <div className="cp-circular-chart-label">Tỷ lệ tham gia cao nhất</div>
                    </div>
                    <div>
                      <div className="cp-circular-chart" style={{
                        background: `conic-gradient(var(--cp-accent) 0% ${89.6 * 3.6}deg, #f1d1d1 ${89.6 * 3.6}deg 360deg)`
                      }}>
                        <div className="cp-circular-chart-text">89.6%</div>
                      </div>
                      <div className="cp-circular-chart-label">Tỷ lệ tham gia trung bình</div>
                    </div>
                  </div>
                </div>
                
                {/* Event satisfaction */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Mức độ hài lòng</div>
                  <div className="cp-analytics-grid">
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Sự kiện được đánh giá cao nhất</div>
                      <div className="cp-stats-value">4.9/5</div>
                      <div className="cp-event-rating-stars" style={{ justifyContent: 'flex-start', marginTop: '4px' }}>
                        {renderStarRating(4.9)}
                      </div>
                    </div>
                    <div className="cp-analytics-card">
                      <div className="cp-stats-label">Đánh giá trung bình</div>
                      <div className="cp-stats-value">4.6/5</div>
                      <div className="cp-event-rating-stars" style={{ justifyContent: 'flex-start', marginTop: '4px' }}>
                        {renderStarRating(4.6)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {statsTab === "members" && (
              <>
                {/* Department breakdown */}
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
                          ></div>
                        </div>
                      </div>
                      <div className="cp-stats-item-value">
                        {dept.members} ({dept.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Gender distribution */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phân bổ giới tính</div>
                  <div className="cp-circular-chart-container">
                    <div>
                      <div className="cp-circular-chart" style={{
                        background: `conic-gradient(var(--cp-accent) 0% ${clubStats.femalePercentage * 3.6}deg, #f1d1d1 ${clubStats.femalePercentage * 3.6}deg 360deg)`
                      }}>
                        <div className="cp-circular-chart-text">{clubStats.femalePercentage}%</div>
                      </div>
                      <div className="cp-circular-chart-label">Nữ</div>
                    </div>
                    <div>
                      <div className="cp-circular-chart" style={{
                        background: `conic-gradient(#f1d1d1 0% ${clubStats.malePercentage * 3.6}deg, var(--cp-accent) ${clubStats.malePercentage * 3.6}deg 360deg)`
                      }}>
                        <div className="cp-circular-chart-text">{clubStats.malePercentage}%</div>
                      </div>
                      <div className="cp-circular-chart-label">Nam</div>
                    </div>
                  </div>
                </div>

                {/* Top members list - with trends */}
                <div className="cp-stats-list">
                  <div className="cp-stats-list-title">Thành viên hoạt động tích cực</div>
                  {topMembers.map((member, index) => (
                    <div key={index} className="cp-stats-list-item">
                      <div className="cp-stats-item-name">{member.name}</div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="cp-stats-item-value">{member.points} điểm</div>
                        <div className={`cp-trend-indicator ${member.trend >= 0 ? 'positive' : 'negative'}`} style={{marginLeft: '8px'}}>
                          <IonIcon icon={member.trend >= 0 ? arrowUpOutline : arrowDownOutline} />
                          {Math.abs(member.trend)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {statsTab === "analytics" && (
              <>
                {/* Advanced analytics dashboard */}
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
                
                {/* Membership growth chart */}
                <div className="cp-stats-chart-container">
                  <div className="cp-stats-list-title">Phát triển thành viên qua thời gian</div>
                  <div style={{height: '140px', background: '#f9f9f9', borderRadius: '8px', margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{color: '#999', fontSize: '14px'}}>Biểu đồ tăng trưởng thành viên</div>
                  </div>
                </div>
                
                {/* Key success metrics */}
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
        )}
      </IonContent>

      {/* Footer shelf for iOS safe area */}
      <div className="cp-footer-shelf"></div>
    </IonPage>
  );
}
