/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from "@ionic/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useMemo, useState } from "react";
import { Printer, ChevronLeft, ChevronRight, Settings } from "lucide-react";

/** ======= Types ======= */
type ClassEvent = {
  id: string;
  title: string;              // Tên môn
  group?: string;             // Nhóm
  room?: string;              // Phòng
  teacher?: string;           // GV
  dow: 1|2|3|4|5|6|7;         // 1=Thứ 2 ... 7=CN
  startPeriod: number;        // 1..10
  endPeriod: number;          // >= startPeriod
  color?: string;             // màu block
};

const PERIODS = 10;

/** ======= Demo data (thay bằng API của bạn) ======= */
const DEMO: ClassEvent[] = [
  {
    id: "esp341-1",
    title: "Tiếng Anh chuyên ngành 4 (Thư tín thương mại) (ESP341)",
    group: "ESP341(2526.1-GD1).1",
    room: "B508 - Nhà B 508",
    teacher: "GV: Lưu Thị Thuỳ Hương",
    dow: 2, startPeriod: 4, endPeriod: 5, color: "#e6f0ff",
  },
  {
    id: "esp341-2",
    title: "Tiếng Anh chuyên ngành 4 (Thư tín thương mại) (ESP341)",
    group: "ESP341(2526.1-GD1).1",
    room: "B508 - Nhà B 508",
    teacher: "GV: Lưu Thị Thuỳ Hương",
    dow: 6, startPeriod: 4, endPeriod: 5, color: "#e6f0ff",
  },
];

/** ======= Học kỳ + mốc tuần (để tính “Tuần X”) ======= */
const SEMESTERS: { id: string; label: string; week0: string }[] = [
  { id: "2025-1", label: "Học kỳ 1 - Năm học 2025 - 2026", week0: "2025-09-01" }, // Thứ 2 đầu tiên HK1
  { id: "2025-2", label: "Học kỳ 2 - Năm học 2025 - 2026", week0: "2026-02-10" },
  { id: "2024-3", label: "Học kỳ 3 - Năm học 2024 - 2025", week0: "2025-06-10" },
];

const VIEWS = [
  { id: "personal", label: "Thời khóa biểu cá nhân" },
  { id: "class", label: "Thời khóa biểu lớp" },
  { id: "faculty", label: "Thời khóa biểu khoa" },
];

/** ======= Date helpers ======= */
function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0 … Sun=6
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmt(d: Date) {
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function diffWeeks(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / (7 * 24 * 3600 * 1000));
}

export default function WeeklyTimetable() {
  const [semesterId, setSemesterId] = useState(SEMESTERS[0].id);
  const [viewId, setViewId] = useState(VIEWS[0].id);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần hiện tại

  const weekStart = useMemo(() => {
    const today = new Date();
    return addDays(startOfWeekMonday(today), weekOffset * 7);
  }, [weekOffset]);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const weekNumber = useMemo(() => {
    const sem = SEMESTERS.find(s => s.id === semesterId)!;
    const w0 = startOfWeekMonday(new Date(sem.week0));
    return diffWeeks(weekStart, w0) + 1; // Tuần 1 tính từ week0
  }, [semesterId, weekStart]);

  // TODO: gọi API theo semesterId + viewId + khoảng tuần => set events
  const events = DEMO;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/tab2" text="" /></IonButtons>
          <IonTitle className="zone-title">THỜI KHÓA BIỂU DẠNG TUẦN</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="mx-auto w-full max-w-6xl p-3 sm:p-4">

          {/* ===== Filter bar ===== */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="w-full md:w-[420px]">
              <Select value={semesterId} onValueChange={setSemesterId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[320px]">
              <Select value={viewId} onValueChange={setViewId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Loại thời khóa biểu" />
                </SelectTrigger>
                <SelectContent>
                  {VIEWS.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> In
              </Button>
            </div>
          </div>

          {/* ===== Week caption & nav ===== */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold">Tuần {weekNumber}</span>{" "}
              [từ ngày <b>{fmt(weekStart)}</b> đến ngày <b>{fmt(weekEnd)}</b>]
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => setWeekOffset(x => x - 1)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setWeekOffset(0)} title="Về tuần hiện tại">
                <Settings className="h-5 w-5 rotate-90" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setWeekOffset(x => x + 1)}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* ===== Grid ===== */}
          <Card className="mt-3 overflow-hidden">
            <CardContent className="p-0">
              {/* Header row */}
              <div
                className="
                  grid
                  [grid-template-columns:theme(spacing.24)_repeat(7,minmax(0,1fr))]
                "
              >
                {/* góc trái trống */}
                <div className="bg-red-700/95 text-white font-semibold px-3 py-2 border-r border-red-800" />

                {["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","Chủ Nhật"].map((d, i) => (
                  <div
                    key={d}
                    className="bg-red-700/95 text-white font-semibold px-3 py-2 border-r border-red-800 text-center"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Body grid with periods */}
              <div className="relative">
                {/* Base grid cells */}
                <div
                  className="
                    grid
                    [grid-template-columns:theme(spacing.24)_repeat(7,minmax(0,1fr))]
                    [grid-template-rows:repeat(10,64px)]
                  "
                >
                  {/* Period labels */}
                  {Array.from({ length: PERIODS }).map((_, r) => (
                    <div
                      key={`p-${r}`}
                      className="border-r border-t border-gray-200/85 bg-white px-3 py-2 text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Tiết {r + 1}
                    </div>
                  ))}

                  {/* Day cells (7 * PERIODS) */}
                  {Array.from({ length: PERIODS * 7 }).map((_, idx) => (
                    <div key={idx} className="border-t border-r border-gray-200/85 bg-white" />
                  ))}
                </div>

                {/* Event blocks – placed absolutely atop the grid */}
                <div className="pointer-events-none absolute inset-0">
                  {events.map((e) => {
                    const col = e.dow;                     // 1..7
                    const rowStart = e.startPeriod;        // 1..10
                    const rowSpan = e.endPeriod - e.startPeriod + 1;

                    // CSS variables for placement
                    const style: React.CSSProperties = {
                      // translate grid placement to absolute coords using CSS calc()
                      // left = width of label col + (col-1)*colWidth
                      // but easier: use CSS grid overlay again:
                    };

                    // We'll use CSS grid overlay to position blocks:
                    return (
                      <div
                        key={e.id}
                        className="
                          grid
                          [grid-template-columns:theme(spacing.24)_repeat(7,minmax(0,1fr))]
                          [grid-template-rows:repeat(10,64px)]
                          h-full w-full
                        "
                      >
                        <div
                          className="pointer-events-auto m-[2px] rounded border border-blue-300 bg-blue-50 p-2 text-xs leading-snug text-slate-700 shadow-sm"
                          style={{
                            gridColumn: `${col + 1} / ${col + 2}`, // +1 vì có cột label đầu
                            gridRow: `${rowStart} / ${rowStart + rowSpan}`,
                            background: e.color ?? "#eef2ff",
                          }}
                        >
                          <div className="font-bold text-[12px]">{e.title}</div>
                          {e.group && <div className="mt-1"><b>Nhóm:</b> {e.group}</div>}
                          {e.room && <div><b>Phòng:</b> {e.room}</div>}
                          {e.teacher && <div><b>{e.teacher}</b></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </IonContent>
    </IonPage>
  );
}
