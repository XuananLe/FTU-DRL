import React, { useMemo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonMenuButton,
  IonSplitPane,
  IonMenu
} from "@ionic/react";
import { downloadOutline, menuOutline, closeOutline } from "ionicons/icons";
import "./admin.css";

type Series = ApexAxisChartSeries | ApexNonAxisChartSeries;

type Club = { name: string; events: number; participants: number; status: "Active" | "Pending" | "Inactive" };
type Student = {
  id: string;
  name: string;
  mssv: string;
  class: string;
  year: number;
  drlPoints: number;
  status: "active" | "graduated" | "suspended";
  eventCount: number;
  avatar?: string;
};
type Event = {
  id: string;
  title: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  participants: number;
  points: number;
  submittedBy: string;
  submittedAt: string;
};

const seed = {
  termLabel: "Kỳ học: Hè 2025",
  kpi: {
    totalEvents: 34,
    totalParticipants: 1200,
    avgDRL: 72,
    activeClubs: 28,
  },
  topClubs: [
    { name: "CLB ACE", events: 12 },
    { name: "CLB Design", events: 8 },
    { name: "CLB Tech", events: 5 },
    { name: "CLB Volunteer", events: 9 },
  ],
  drlDist: {
    labels: ["Xuất sắc", "Tốt", "Khá", "Yếu"],
    series: [25, 35, 30, 10],
  },
  clubs: [
    { name: "CLB ACE", events: 12, participants: 420, status: "Active" },
    { name: "CLB Design", events: 8, participants: 210, status: "Active" },
    { name: "CLB Tech", events: 5, participants: 150, status: "Pending" },
    { name: "CLB Volunteer", events: 9, participants: 310, status: "Active" },
  ] as Club[],
  students: [
    { id: "s1", name: "Nguyễn Văn A", mssv: "FTU0012345", class: "KTQTII-K58", year: 3, drlPoints: 88, status: "active", eventCount: 7 },
    { id: "s2", name: "Trần Thị B", mssv: "FTU0023456", class: "KTQTI-K59", year: 2, drlPoints: 92, status: "active", eventCount: 9 },
    { id: "s3", name: "Lê Văn C", mssv: "FTU0034567", class: "TTTML-K58", year: 3, drlPoints: 75, status: "active", eventCount: 4 },
    { id: "s4", name: "Phạm Thị D", mssv: "FTU0045678", class: "TMDT-K57", year: 4, drlPoints: 68, status: "suspended", eventCount: 2 },
    { id: "s5", name: "Hoàng Văn E", mssv: "FTU0056789", class: "KTĐN-K59", year: 2, drlPoints: 82, status: "active", eventCount: 6 },
    { id: "s6", name: "Đỗ Thị F", mssv: "FTU0067890", class: "QTKD-K58", year: 3, drlPoints: 79, status: "active", eventCount: 5 }
  ] as Student[],
  events: [
    { 
      id: "e1", 
      title: "Workshop Kỹ năng thuyết trình", 
      clubName: "CLB ACE", 
      date: "12/10/2025", 
      time: "14:30", 
      location: "Hội trường A", 
      status: "pending", 
      participants: 80,
      points: 5,
      submittedBy: "Nguyễn Văn X",
      submittedAt: "05/10/2025"
    },
    { 
      id: "e2", 
      title: "Talkshow Startup và Đổi mới sáng tạo", 
      clubName: "CLB Tech", 
      date: "15/10/2025", 
      time: "09:00", 
      location: "Hội trường B", 
      status: "pending", 
      participants: 120,
      points: 8,
      submittedBy: "Trần Thị Y",
      submittedAt: "02/10/2025"
    },
    { 
      id: "e3", 
      title: "Hội thảo Chuyển đổi số trong TMĐT", 
      clubName: "CLB Design", 
      date: "18/10/2025", 
      time: "15:00", 
      location: "Phòng hội thảo C304", 
      status: "approved", 
      participants: 60,
      points: 6,
      submittedBy: "Lê Văn Z",
      submittedAt: "28/09/2025"
    },
    { 
      id: "e4", 
      title: "Tình nguyện vì cộng đồng", 
      clubName: "CLB Volunteer", 
      date: "20/10/2025", 
      time: "07:30", 
      location: "KTX Phương Trạch", 
      status: "rejected", 
      participants: 45,
      points: 10,
      submittedBy: "Phạm Thị K",
      submittedAt: "01/10/2025"
    }
  ] as Event[]
};

type MenuKey = "dashboard" | "clubs" | "students" | "approvals";

export default function AdminDashboard() {
  const [menu, setMenu] = useState<MenuKey>("dashboard");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Add resize listener to update chart sizes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==== CHART OPTIONS ====
  const topClubsOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { 
      type: "bar", 
      toolbar: { show: false },
      redrawOnWindowResize: true,
      redrawOnParentResize: true,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: '#ffffff',
      animations: {
        enabled: false  // Disable animations for better mobile performance
      }
    },
    plotOptions: { 
      bar: { 
        horizontal: true, 
        borderRadius: 4,
        barHeight: windowWidth < 576 ? "60%" : "40%",
        distributed: false,
      } 
    },
    grid: { 
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: windowWidth < 576 ? 0 : 10
      }
    },
    xaxis: { 
      categories: seed.topClubs.map(c => c.name),
      labels: {
        style: {
          fontSize: windowWidth < 576 ? '10px' : '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        trim: windowWidth < 576,
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: windowWidth < 576 ? '10px' : '12px',
        },
        maxWidth: windowWidth < 576 ? 100 : 150,
      }
    },
    colors: ["#b30018"],
    dataLabels: { 
      enabled: windowWidth < 576 ? true : false,
      style: {
        fontSize: '10px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 'bold',
      },
      formatter: (val) => val.toString()
    },
    tooltip: { 
      enabled: windowWidth > 576,
      shared: true, 
      intersect: false,
      style: {
        fontSize: '12px',
      }
    },
    legend: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.1
        }
      }
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 180
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '60%'
            }
          }
        }
      }
    ]
  }), [windowWidth]);

  const pieOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { 
      type: "pie", 
      toolbar: { show: false },
      redrawOnWindowResize: true,
      redrawOnParentResize: true,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: '#ffffff',
      animations: {
        enabled: false // Disable animations for better mobile performance
      }
    },
    labels: seed.drlDist.labels,
    legend: { 
      show: windowWidth < 576 ? false : true,
      position: "bottom",
      fontSize: windowWidth < 768 ? '10px' : '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      itemMargin: {
        horizontal: windowWidth < 576 ? 2 : 5,
        vertical: 0
      },
      formatter: (seriesName, opts) => {
        return windowWidth < 576 
          ? seriesName.substring(0, 4) 
          : seriesName
      },
      offsetY: windowWidth < 576 ? -5 : 0
    },
    colors: ["#0ea85f", "#f59e0b", "#f97316", "#ef4444"],
    tooltip: { 
      enabled: true,
      style: {
        fontSize: '12px'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: windowWidth < 576 ? '8px' : '10px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      formatter: (val) => {
        return windowWidth < 576 ? `${Math.round(val as number)}%` : `${val}%`;
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 3,
        opacity: 0.5
      }
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: windowWidth < 576 ? '60%' : '50%',
          labels: {
            show: false
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 180
          },
          plotOptions: {
            pie: {
              dataLabels: {
                offset: -15
              }
            }
          }
        }
      }
    ]
  }), [windowWidth]);

  // ==== VIEWS ====
  const ViewDashboard = () => (
    <>
      {/* KPI strip */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Tổng số sự kiện</div>
          <div className="kpi-value" style={{ color: '#0ea85f' }}>{seed.kpi.totalEvents}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tổng SV tham gia</div>
          <div className="kpi-value" style={{ color: '#1d4ed8' }}>{seed.kpi.totalParticipants}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Điểm DRL trung bình</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>{seed.kpi.avgDRL}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CLB hoạt động</div>
          <div className="kpi-value" style={{ color: '#b30018' }}>{seed.kpi.activeClubs}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Top clubs (bar horizontal) + list labels bên trái */}
        <div className="card">
          <div className="card-title">Số sự kiện theo CLB (Top 6)</div>
          <div className="topclubs-wrap">
            <ul className="topclubs-list">
              {seed.topClubs.map((c) => (
                <li key={c.name}><span className="dot" /> {c.name}</li>
              ))}
            </ul>
            <div className="topclubs-chart">
                          <ReactApexChart
              type="bar"
              height={window.innerWidth < 576 ? 200 : 260}
              options={topClubsOptions}
              series={[{ name: "Sự kiện", data: seed.topClubs.map(c => c.events) }] as unknown as Series}
            />
            </div>
          </div>
        </div>

        {/* DRL distribution pie */}
        <div className="card">
          <div className="card-title">Phân bố điểm DRL</div>
          <ReactApexChart
            type="pie"
            height={window.innerWidth < 576 ? 200 : 260}
            options={pieOptions}
            series={seed.drlDist.series as unknown as Series}
          />
          <div className="legend-custom">
            {seed.drlDist.labels.map((lb, i) => (
              <div key={lb}><span className={`lg lg-${i}`} /> {lb}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const ViewClubs = () => (
    <div className="card">
      <div className="card-title">Quản lý CLB <span className="sub">(Tổng {seed.clubs.length} CLB)</span></div>
      <div className="table">
        <div className="tr th">
          <div>CLB</div><div>Sự kiện</div><div>SV tham gia</div><div>Trạng thái</div><div></div>
        </div>
        {seed.clubs.map((c) => (
          <div key={c.name} className="tr">
            <div>{c.name}</div>
            <div>{c.events}</div>
             <div>{c.participants}</div>
            <div className={`badge ${c.status === "Active" ? "ok" : c.status === "Pending" ? "pending" : ""}`}>
              {c.status}
            </div>
            <div><button className="btn-outline">Xem</button></div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewStudents = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    
    // Filter students based on search term and filter selection
    const filteredStudents = seed.students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase());
        
      if (selectedFilter === "all") return matchesSearch;
      if (selectedFilter === "active") return matchesSearch && student.status === "active";
      if (selectedFilter === "suspended") return matchesSearch && student.status === "suspended";
      if (selectedFilter === "high-points") return matchesSearch && student.drlPoints >= 85;
      if (selectedFilter === "low-points") return matchesSearch && student.drlPoints < 70;
      
      return matchesSearch;
    });
    
    return (
      <div className="card">
        <div className="card-title">
          Quản lý Sinh viên 
          <span className="sub">(Tổng {seed.students.length} sinh viên)</span>
        </div>
        
        {/* Search and filter */}
        <div className="search-box">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm theo tên, MSSV, lớp..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-bar">
            <button 
              className={`filter-chip ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={`filter-chip ${selectedFilter === 'active' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('active')}
            >
              Đang học
            </button>
            <button 
              className={`filter-chip ${selectedFilter === 'suspended' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('suspended')}
            >
              Đình chỉ
            </button>
            <button 
              className={`filter-chip ${selectedFilter === 'high-points' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('high-points')}
            >
              Điểm cao (≥85)
            </button>
            <button 
              className={`filter-chip ${selectedFilter === 'low-points' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('low-points')}
            >
              Điểm thấp (&lt;70)
            </button>
          </div>
        </div>
        
        {/* Student list */}
        <div className="student-list">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div key={student.id} className="student-item">
                <div className="student-avatar">
                  {student.avatar || student.name.charAt(0)}
                </div>
                
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-meta">
                    <span><b>MSSV:</b> {student.mssv}</span>
                    <span><b>Lớp:</b> {student.class}</span>
                    <span><b>Năm:</b> {student.year}</span>
                    <span 
                      style={{ 
                        color: student.drlPoints >= 85 ? '#0ea85f' : 
                               student.drlPoints >= 70 ? '#f59e0b' : 
                               '#ef4444'
                      }}
                    >
                      <b>Điểm DRL:</b> {student.drlPoints}
                    </span>
                    <span>
                      <b>Trạng thái:</b> 
                      <span className={`status ${student.status === 'active' ? 'approved' : 'rejected'}`}>
                        {student.status === 'active' ? 'Đang học' : 'Đình chỉ'}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="actions">
                  <button className="action-button small">Xem chi tiết</button>
                  <button className="action-button small outline">Chỉnh sửa</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👨‍🎓</div>
              <h3 className="empty-title">Không tìm thấy sinh viên</h3>
              <p className="empty-text">
                Không có sinh viên nào phù hợp với tiêu chí tìm kiếm. Vui lòng thử lại với các bộ lọc khác.
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="pagination">
          <button className="page-button">«</button>
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <button className="page-button">»</button>
        </div>
      </div>
    );
  };

  const ViewApprovals = () => {
    const [statusFilter, setStatusFilter] = useState("pending");
    
    // Filter events by status
    const filteredEvents = seed.events.filter(event => {
      if (statusFilter === "all") return true;
      return event.status === statusFilter;
    });
    
    const pendingCount = seed.events.filter(e => e.status === "pending").length;
    
    return (
      <div className="card">
        <div className="card-title">
          Phê duyệt Sự kiện
          {pendingCount > 0 && (
            <span className="sub" style={{ color: '#b30018' }}>
              ({pendingCount} sự kiện chờ duyệt)
            </span>
          )}
        </div>
        
        {/* Status filter */}
        <div className="approval-filter">
          <button 
            className={`approval-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`approval-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Chờ duyệt ({pendingCount})
          </button>
          <button 
            className={`approval-tab ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Đã duyệt
          </button>
          <button 
            className={`approval-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Từ chối
          </button>
        </div>
        
        {/* Event list */}
        <div className="event-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div key={event.id} className="event-item">
                <div className="event-circle">
                  {event.clubName.substring(4, 5) || 
                   ["A", "T", "D", "V"][index % 4] /* Fallback to match screenshots */}
                </div>
                
                <div className="event-info-mobile">
                  <div className="event-row">
                    <div><b>Ngày:</b> {event.date}</div>
                  </div>
                  <div className="event-row">
                    <div><b>Giờ:</b> {event.time}</div>
                  </div>
                  <div className="event-row">
                    <div><b>Địa điểm:</b> {event.location}</div>
                  </div>
                  <div className="event-row">
                    <div><b>Điểm DRL:</b> {event.points}</div>
                  </div>
                  <div className="event-row">
                    <div>
                      <b>Trạng thái:</b>
                      <span className={`event-status ${event.status}`}>
                        {event.status === 'pending' ? 'Chờ duyệt' : 
                         event.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="event-actions">
                  {event.status === 'pending' ? (
                    <>
                      <button className="approval-button approve">Duyệt</button>
                      <button className="approval-button reject">Từ chối</button>
                    </>
                  ) : (
                    <button className="approval-button detail">Chi tiết</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3 className="empty-title">Không có sự kiện</h3>
              <p className="empty-text">
                Không có sự kiện nào {statusFilter === 'pending' ? 'đang chờ phê duyệt' : 
                                      statusFilter === 'approved' ? 'đã được duyệt' : 
                                      statusFilter === 'rejected' ? 'đã bị từ chối' : ''} 
                trong thời gian này.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // We don't need the sidebarOpen state anymore since we're using IonMenu
  // which has its own internal state management

  return (
    <IonSplitPane contentId="admin-content">
      {/* Menu that will be displayed when shown */}
      <IonMenu contentId="admin-content" type="overlay">
        <IonContent>
          <div className="brand">
            <div className="avatar">ST</div>
            <div>
              <b>School Admin</b>
              <div className="muted">Quản trị hệ thống</div>
            </div>
            {/* Close button for mobile sidebar */}
            <IonButton 
              fill="clear" 
              size="small"
              className="sidebar-close-btn"
              onClick={() => document.querySelector('ion-menu')?.close()}
              style={{ marginLeft: 'auto', display: 'block' }}
            >
              <IonIcon icon={closeOutline} style={{ fontSize: '20px', color: '#666' }} />
            </IonButton>
          </div>
          
          <div className="menu">
          <button 
            className={menu === "dashboard" ? "active" : ""} 
            onClick={() => {
              setMenu("dashboard");
              if (window.innerWidth <= 768) document.querySelector('ion-menu')?.close();
            }}
          >
            Dashboard
          </button>
          <button 
            className={menu === "clubs" ? "active" : ""} 
            onClick={() => {
              setMenu("clubs");
              if (window.innerWidth <= 768) document.querySelector('ion-menu')?.close();
            }}
          >
            Quản lý CLB
          </button>
          <button 
            className={menu === "students" ? "active" : ""} 
            onClick={() => {
              setMenu("students");
              if (window.innerWidth <= 768) document.querySelector('ion-menu')?.close();
            }}
          >
            Quản lý SV
          </button>
          <button 
            className={menu === "approvals" ? "active" : ""} 
            onClick={() => {
              setMenu("approvals");
              if (window.innerWidth <= 768) document.querySelector('ion-menu')?.close();
            }}
          >
            Phê duyệt sự kiện
          </button>
          </div>
        </IonContent>
      </IonMenu>
      
      {/* Main content */}
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar color="danger" className="curved-toolbar">
            <div slot="start" className="mobile-menu-btn">
              <IonMenuButton />
            </div>
            <IonTitle className="zone-title">
              {menu === "dashboard" && "Dashboard"}
              {menu === "clubs" && "Quản lý CLB"}
              {menu === "students" && "Quản lý Sinh viên"}
              {menu === "approvals" && "Phê duyệt Sự kiện"}
            </IonTitle>
            <div slot="end" className="term-actions">
              <span className="term">{seed.termLabel}</span>
              <IonButton size="small" fill="solid" color="light">
                <IonIcon icon={downloadOutline} slot="start" />
                {windowWidth > 576 ? 'Xuất báo cáo' : 'Xuất BC'}
              </IonButton>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="admin-content">
          <div className="admin-shell">
            {/* Main content */}
            <main className="content">
              {menu === "dashboard" && <ViewDashboard />}
              {menu === "clubs" && <ViewClubs />}
              {menu === "students" && <ViewStudents />}
              {menu === "approvals" && <ViewApprovals />}
            </main>
          </div>
        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
}
