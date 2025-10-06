import React, { useMemo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonMenuButton
} from "@ionic/react";
import { downloadOutline, menuOutline, closeOutline } from "ionicons/icons";
import "./admin.css";

type Series = ApexAxisChartSeries | ApexNonAxisChartSeries;

type Club = { name: string; events: number; participants: number; status: "Active" | "Pending" | "Inactive" };

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

  const ViewStudents = () => (
    <div className="card">
      <div className="card-title">Quản lý Sinh viên</div>
      <div className="placeholder">Tính năng tìm kiếm MSSV, xem lịch sử DRL (demo chưa bật)</div>
    </div>
  );

  const ViewApprovals = () => (
    <div className="card">
      <div className="card-title">Phê duyệt Sự kiện</div>
      <div className="placeholder">Danh sách sự kiện chờ duyệt (demo chưa có sự kiện chờ)</div>
    </div>
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes to large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node) && overlay) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <div slot="start" className="mobile-menu-btn">
            <IonButton fill="clear" color="light" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <IonIcon icon={menuOutline} />
            </IonButton>
          </div>
          <IonTitle className="zone-title">Dashboard</IonTitle>
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
          {/* Sidebar overlay for mobile */}
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
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
                onClick={() => setSidebarOpen(false)}
                style={{ marginLeft: 'auto', display: 'block' }}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <nav className="menu">
              <button 
                className={menu === "dashboard" ? "active" : ""} 
                onClick={() => {
                  setMenu("dashboard");
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                Dashboard
              </button>
              <button 
                className={menu === "clubs" ? "active" : ""} 
                onClick={() => {
                  setMenu("clubs");
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                Quản lý CLB
              </button>
              <button 
                className={menu === "students" ? "active" : ""} 
                onClick={() => {
                  setMenu("students");
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                Quản lý SV
              </button>
              <button 
                className={menu === "approvals" ? "active" : ""} 
                onClick={() => {
                  setMenu("approvals");
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                Phê duyệt sự kiện
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="content">
            <h2 className="page-title">
              {menu === "dashboard" && "Dashboard tổng quan"}
              {menu === "clubs" && "Quản lý CLB"}
              {menu === "students" && "Quản lý Sinh viên"}
              {menu === "approvals" && "Phê duyệt Sự kiện"}
            </h2>

            {menu === "dashboard" && <ViewDashboard />}
            {menu === "clubs" && <ViewClubs />}
            {menu === "students" && <ViewStudents />}
            {menu === "approvals" && <ViewApprovals />}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
