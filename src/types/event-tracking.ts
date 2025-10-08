export enum EventStatus {
  REGISTERED = 'registered',
  PARTICIPATED = 'participated',
  COULD_NOT_PARTICIPATE = 'could_not_participate',
  COULD_NOT_CHECK_OUT = 'could_not_check_out',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

export interface EventTracking {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  studentId: string; // MSSV
  studentName: string;
  status: EventStatus;
  registeredAt: Date;
  participatedAt?: Date;
  checkedOutAt?: Date;
  notes?: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventTrackingHistory {
  id: string;
  trackingId: string;
  previousStatus: EventStatus;
  newStatus: EventStatus;
  changedAt: Date;
  reason?: string;
  changedBy?: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: Date;
  location?: string;
  maxParticipants?: number;
  isActive: boolean;
  createdAt: Date;
  imageUrl?: string;
}

export interface EventStatistics {
  totalRegistered: number;
  totalParticipated: number;
  totalCheckedOut: number;
  totalCouldNotParticipate: number;
  totalCouldNotCheckOut: number;
  totalCancelled: number;
  participationRate: number;
  checkoutRate: number;
}