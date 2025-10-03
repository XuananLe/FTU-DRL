/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from "@ionic/react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";

import { useMemo, useState, Fragment, useEffect } from "react";
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
    dow: 3, startPeriod: 4, endPeriod: 5, color: "#e6f0ff",
  },
  {
    id: "esp341-2",
    title: "Tiếng Anh chuyên ngành 4 (Thư tín thương mại) (ESP341)",
    group: "ESP341(2526.1-GD1).1",
    room: "B508 - Nhà B 508",
    teacher: "GV: Lưu Thị Thuỳ Hương",
    dow: 6, startPeriod: 2, endPeriod: 3, color: "#e6f0ff",
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
  const [isPortraitMode, setIsPortraitMode] = useState(window.innerWidth < 768);

  // Responsive design detection
  useEffect(() => {
    const handleResize = () => {
      setIsPortraitMode(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Choose display mode based on screen orientation
  const renderTimetable = () => {
    if (!isPortraitMode) {
      // Desktop/Landscape view - Full week grid
      return (
        <Card className="mt-2">
          <CardContent className="p-0">
            {/* Header row */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)]">
              <div className="bg-red-700 text-white font-semibold p-2 border-r border-red-800"></div>
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"].map((d) => (
                <div key={d} className="bg-red-700 text-white font-semibold p-2 text-center border-r border-red-800">
                  {d}
                </div>
              ))}
            </div>

            {/* Timetable body */}
            <div className="relative">
              <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                {/* Periods 1-10 */}
                {Array.from({ length: PERIODS }).map((_, idx) => (
                  <Fragment key={`row-${idx + 1}`}>
                    <div className="border-t border-r border-gray-200 bg-white p-1 md:p-2 h-12 flex items-center justify-center font-medium text-sm">
                      Tiết {idx + 1}
                    </div>
                    {/* Empty cells for each day */}
                    {Array.from({ length: 7 }).map((_, dayIdx) => (
                      <div key={`cell-${idx+1}-${dayIdx+1}`} className="border-t border-r border-gray-200 bg-white h-12"></div>
                    ))}
                  </Fragment>
                ))}
              </div>

              {/* Class events */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {events.map((e) => {
                  // Convert from 1-based to 0-based for array indexing
                  const dayIndex = e.dow - 1; // 0=Mon, 1=Tue, ..., 6=Sun
                  const startPeriod = e.startPeriod - 1; // 0-based
                  const duration = e.endPeriod - e.startPeriod + 1;
                  
                  // Calculate position
                  const left = `calc(80px + ${dayIndex} * (100% - 80px) / 7)`;
                  const top = `${startPeriod * 48}px`; // 48px = height of each period row
                  const width = `calc((100% - 80px) / 7 - 4px)`; // 4px for margins
                  const height = `${duration * 48 - 4}px`; // 4px for margins
                  
                  return (
                    <div 
                      key={e.id}
                      className="pointer-events-auto absolute border border-blue-300 bg-blue-50 p-2 rounded text-xs shadow-sm"
                      style={{
                        left,
                        top,
                        width,
                        height,
                        background: e.color || "#e6f0ff",
                      }}
                    >
                      <div className="text-xs font-bold line-clamp-1">{e.title}</div>
                      {e.group && <div className="mt-0.5 line-clamp-1">Nhóm: {e.group}</div>}
                      {e.room && <div className="line-clamp-1">Phòng: {e.room}</div>}
                      {e.teacher && <div className="line-clamp-1">{e.teacher}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Mobile/Portrait view - Day-by-day view with cards
      const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
      return (
        <div className="flex flex-col gap-4 mt-2 px-3 pb-6">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const dayEvents = events.filter(e => e.dow === dayIndex + 1);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <Card key={`day-${dayIndex}`} className={hasEvents ? "" : "opacity-60"}>
                <CardContent className="p-0">
                  <div className="bg-red-700 text-white font-semibold p-3 text-center">
                    {daysOfWeek[dayIndex]} ({fmt(addDays(weekStart, dayIndex))})
                  </div>
                  
                  {hasEvents ? (
                    <div className="p-3">
                      {dayEvents.map(event => (
                        <div key={event.id} className="mb-3 p-3 rounded-md border border-blue-300 bg-blue-50">
                          <div className="font-bold">{event.title}</div>
                          {event.group && <div className="mt-1 text-sm">Nhóm: {event.group}</div>}
                          {event.room && <div className="text-sm">Phòng: {event.room}</div>}
                          {event.teacher && <div className="text-sm">{event.teacher}</div>}
                          <div className="mt-1 text-sm font-medium">
                            Tiết: {event.startPeriod} - {event.endPeriod}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">Không có lịch học</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/tab2" text="" /></IonButtons>
          <IonTitle className="zone-title">THỜI KHÓA BIỂU DẠNG TUẦN</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="mx-auto w-full max-w-6xl">
          {/* ===== Filter bar ===== */}
          <div className="bg-red-700 p-3 flex flex-col gap-3">
            <div className="w-full">
              <Select value={semesterId} onValueChange={setSemesterId}>
                <SelectTrigger className="h-10 bg-white text-black w-full">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Select value={viewId} onValueChange={setViewId}>
                <SelectTrigger className="h-10 bg-white text-black w-full">
                  <SelectValue placeholder="Loại thời khóa biểu" />
                </SelectTrigger>
                <SelectContent>
                  {VIEWS.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="text-white text-sm">
                <span className="font-semibold">Tuần {weekNumber}</span>{" "}
                [{fmt(weekStart)} - {fmt(weekEnd)}]
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white text-red-700 hover:bg-gray-100" 
                  onClick={() => setWeekOffset(x => x - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white text-red-700 hover:bg-gray-100"
                  onClick={() => setWeekOffset(0)} title="Về tuần hiện tại">
                  <Settings className="h-4 w-4 rotate-90" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white text-red-700 hover:bg-gray-100"
                  onClick={() => setWeekOffset(x => x + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white text-red-700 hover:bg-gray-100 ml-1" 
                  onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Responsive Timetable - Grid for desktop, Cards for mobile */}
          {renderTimetable()}
        </div>
      </IonContent>
    </IonPage>
  );
}
