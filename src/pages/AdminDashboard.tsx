import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon
} from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
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

  // ==== CHART OPTIONS ====
  const topClubsOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: "40%" } },
    grid: { borderColor: "#eee" },
    xaxis: { categories: seed.topClubs.map(c => c.name) },
    colors: ["#b30018"],
    dataLabels: { enabled: false },
    tooltip: { shared: true, intersect: false }, // tránh lỗi shared + intersect :contentReference[oaicite:2]{index=2}
  }), []);

  const pieOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "pie", toolbar: { show: false } },
    labels: seed.drlDist.labels,
    legend: { position: "bottom" },
    colors: ["#0ea85f", "#f59e0b", "#f97316", "#ef4444"],
    tooltip: { shared: true, intersect: false },
  }), []);

  // ==== VIEWS ====
  const ViewDashboard = () => (
    <>
      {/* KPI strip */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Tổng số sự kiện</div>
          <div className="kpi-value">{seed.kpi.totalEvents}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tổng SV tham gia</div>
          <div className="kpi-value">{seed.kpi.totalParticipants}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Điểm DRL trung bình</div>
          <div className="kpi-value">{seed.kpi.avgDRL}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CLB hoạt động</div>
          <div className="kpi-value">{seed.kpi.activeClubs}</div>
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
                height={260}
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
            height={260}
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Dashboard</IonTitle>
          <div slot="end" className="term-actions">
            <span className="term">{seed.termLabel}</span>
            <IonButton size="small" fill="solid" color="light">
              <IonIcon icon={downloadOutline} slot="start" />
              Xuất báo cáo
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="admin-shell">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="brand">
              <div className="avatar">ST</div>
              <div><b>School Admin</b><div className="muted">Quản trị hệ thống</div></div>
            </div>

            <nav className="menu">
              <button className={menu === "dashboard" ? "active" : ""} onClick={() => setMenu("dashboard")}>Dashboard</button>
              <button className={menu === "clubs" ? "active" : ""} onClick={() => setMenu("clubs")}>Quản lý CLB</button>
              <button className={menu === "students" ? "active" : ""} onClick={() => setMenu("students")}>Quản lý SV</button>
              <button className={menu === "approvals" ? "active" : ""} onClick={() => setMenu("approvals")}>Phê duyệt sự kiện</button>
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
