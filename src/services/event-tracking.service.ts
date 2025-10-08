import { EventStatus, EventTracking, EventTrackingHistory, Event, EventStatistics } from '../types/event-tracking';

export class EventTrackingService {
  private trackingRecords: EventTracking[] = [];
  private historyRecords: EventTrackingHistory[] = [];
  private events: Event[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Initialize with some mock data
  private initializeMockData() {
    // Sample events
    this.events = [
      {
        id: 'event-1',
        name: 'Hội thảo Khoa học Máy tính 2025',
        description: 'Hội thảo về AI và Machine Learning',
        date: new Date('2025-11-15'),
        location: 'Hội trường A1',
        maxParticipants: 100,
        isActive: true,
        createdAt: new Date('2025-10-01'),
        imageUrl: '/assets/events/event-1.jpg'
      },
      {
        id: 'event-2',
        name: 'Workshop React & TypeScript',
        description: 'Khóa học về phát triển web hiện đại',
        date: new Date('2025-11-20'),
        location: 'Phòng Lab 2',
        maxParticipants: 50,
        isActive: true,
        createdAt: new Date('2025-10-02'),
        imageUrl: '/assets/events/event-2.jpg'
      },
      {
        id: 'event-3',
        name: 'Cuộc thi Lập trình FTU',
        description: 'Cuộc thi lập trình dành cho sinh viên',
        date: new Date('2025-12-01'),
        location: 'Hội trường B',
        maxParticipants: 200,
        isActive: true,
        createdAt: new Date('2025-10-03'),
        imageUrl: '/assets/events/event-3.jpg'
      },
      {
        id: 'event-4',
        name: 'Ngày hội Sinh viên FTU',
        description: 'Sự kiện văn hóa, thể thao và giải trí',
        date: new Date('2025-12-15'),
        location: 'Sân vận động FTU',
        maxParticipants: 500,
        isActive: true,
        createdAt: new Date('2025-10-04'),
        imageUrl: '/assets/events/event-4.jpg'
      }
    ];

    // Sample tracking records - simulating current user (SV001 - Vuong Anh)
    this.trackingRecords = [
      {
        id: 'track-1',
        eventId: 'event-1',
        eventName: 'Hội thảo Khoa học Máy tính 2025',
        userId: 'current-user',
        studentId: '2311510018',
        studentName: 'Vuong Anh',
        status: EventStatus.PARTICIPATED,
        registeredAt: new Date('2025-10-05'),
        participatedAt: new Date('2025-11-15'),
        createdAt: new Date('2025-10-05'),
        updatedAt: new Date('2025-11-15'),
        notes: 'Tham gia đầy đủ'
      },
      {
        id: 'track-2',
        eventId: 'event-2',
        eventName: 'Workshop React & TypeScript',
        userId: 'current-user',
        studentId: '2311510018',
        studentName: 'Vuong Anh',
        status: EventStatus.REGISTERED,
        registeredAt: new Date('2025-10-06'),
        createdAt: new Date('2025-10-06'),
        updatedAt: new Date('2025-10-06')
      },
      {
        id: 'track-3',
        eventId: 'event-3',
        eventName: 'Cuộc thi Lập trình FTU',
        userId: 'current-user',
        studentId: '2311510018',
        studentName: 'Vuong Anh',
        status: EventStatus.CHECKED_OUT,
        registeredAt: new Date('2025-10-07'),
        participatedAt: new Date('2025-12-01'),
        checkedOutAt: new Date('2025-12-01'),
        createdAt: new Date('2025-10-07'),
        updatedAt: new Date('2025-12-01'),
        reason: 'Hoàn thành xuất sắc'
      },
      {
        id: 'track-4',
        eventId: 'event-4',
        eventName: 'Ngày hội Sinh viên FTU',
        userId: 'current-user',
        studentId: '2311510018',
        studentName: 'Vuong Anh',
        status: EventStatus.COULD_NOT_PARTICIPATE,
        registeredAt: new Date('2025-10-08'),
        createdAt: new Date('2025-10-08'),
        updatedAt: new Date('2025-10-08'),
        reason: 'Có việc gia đình đột xuất'
      },
      // Other students' records
      {
        id: 'track-5',
        eventId: 'event-1',
        eventName: 'Hội thảo Khoa học Máy tính 2025',
        userId: 'user-2',
        studentId: 'SV002',
        studentName: 'Trần Thị B',
        status: EventStatus.REGISTERED,
        registeredAt: new Date('2025-10-06'),
        createdAt: new Date('2025-10-06'),
        updatedAt: new Date('2025-10-06')
      }
    ];
  }

  // Register for an event
  async registerForEvent(
    eventId: string, 
    userId: string, 
    studentId: string, 
    studentName: string, 
    notes?: string
  ): Promise<EventTracking> {
    const event = this.events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if already registered
    const existingTracking = this.trackingRecords.find(
      t => t.eventId === eventId && t.userId === userId
    );
    if (existingTracking) {
      throw new Error('Already registered for this event');
    }

    const tracking: EventTracking = {
      id: this.generateId(),
      eventId,
      eventName: event.name,
      userId,
      studentId,
      studentName,
      status: EventStatus.REGISTERED,
      registeredAt: new Date(),
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trackingRecords.push(tracking);
    return tracking;
  }

  // Update event status
  async updateEventStatus(
    trackingId: string, 
    newStatus: EventStatus, 
    reason?: string,
    changedBy?: string
  ): Promise<EventTracking> {
    const tracking = this.trackingRecords.find(t => t.id === trackingId);
    if (!tracking) {
      throw new Error('Tracking record not found');
    }

    const previousStatus = tracking.status;
    
    // Add to history
    this.historyRecords.push({
      id: this.generateId(),
      trackingId,
      previousStatus,
      newStatus,
      changedAt: new Date(),
      reason,
      changedBy
    });

    // Update tracking record
    tracking.status = newStatus;
    tracking.updatedAt = new Date();
    if (reason) tracking.reason = reason;

    // Set specific timestamps based on status
    switch (newStatus) {
      case EventStatus.PARTICIPATED:
        tracking.participatedAt = new Date();
        break;
      case EventStatus.CHECKED_OUT:
        tracking.checkedOutAt = new Date();
        break;
    }

    return tracking;
  }

  // Get all events
  async getEvents(): Promise<Event[]> {
    return this.events.filter(e => e.isActive);
  }

  // Get tracking by event and user
  async getEventTracking(eventId: string, userId: string): Promise<EventTracking | null> {
    return this.trackingRecords.find(t => t.eventId === eventId && t.userId === userId) || null;
  }

  // Get all trackings for a user
  async getUserTrackings(userId: string): Promise<EventTracking[]> {
    return this.trackingRecords.filter(t => t.userId === userId);
  }

  // Get all trackings for an event
  async getEventTrackings(eventId: string): Promise<EventTracking[]> {
    return this.trackingRecords.filter(t => t.eventId === eventId);
  }

  // Get trackings by student ID
  async getStudentTrackings(studentId: string): Promise<EventTracking[]> {
    return this.trackingRecords.filter(t => t.studentId === studentId);
  }

  // Get tracking history
  async getTrackingHistory(trackingId: string): Promise<EventTrackingHistory[]> {
    return this.historyRecords.filter(h => h.trackingId === trackingId);
  }

  // Get events by status for a user
  async getEventsByStatus(userId: string, status: EventStatus): Promise<EventTracking[]> {
    return this.trackingRecords.filter(t => t.userId === userId && t.status === status);
  }

  // Get all trackings (for admin)
  async getAllTrackings(): Promise<EventTracking[]> {
    return this.trackingRecords;
  }

  // Search trackings by student ID or name
  async searchTrackings(query: string): Promise<EventTracking[]> {
    const lowerQuery = query.toLowerCase();
    return this.trackingRecords.filter(t => 
      t.studentId.toLowerCase().includes(lowerQuery) ||
      t.studentName.toLowerCase().includes(lowerQuery)
    );
  }

  // Get event statistics
  async getEventStatistics(eventId?: string): Promise<EventStatistics> {
    const trackings = eventId 
      ? this.trackingRecords.filter(t => t.eventId === eventId)
      : this.trackingRecords;

    const totalRegistered = trackings.filter(t => t.status === EventStatus.REGISTERED).length;
    const totalParticipated = trackings.filter(t => t.status === EventStatus.PARTICIPATED).length;
    const totalCheckedOut = trackings.filter(t => t.status === EventStatus.CHECKED_OUT).length;
    const totalCouldNotParticipate = trackings.filter(t => t.status === EventStatus.COULD_NOT_PARTICIPATE).length;
    const totalCouldNotCheckOut = trackings.filter(t => t.status === EventStatus.COULD_NOT_CHECK_OUT).length;
    const totalCancelled = trackings.filter(t => t.status === EventStatus.CANCELLED).length;

    const totalRegistrations = trackings.length;
    const totalSuccessfulParticipations = totalParticipated + totalCheckedOut;
    
    const participationRate = totalRegistrations > 0 
      ? (totalSuccessfulParticipations / totalRegistrations) * 100 
      : 0;
    
    const checkoutRate = totalParticipated > 0 
      ? (totalCheckedOut / totalParticipated) * 100 
      : 0;

    return {
      totalRegistered,
      totalParticipated,
      totalCheckedOut,
      totalCouldNotParticipate,
      totalCouldNotCheckOut,
      totalCancelled,
      participationRate: Math.round(participationRate * 100) / 100,
      checkoutRate: Math.round(checkoutRate * 100) / 100
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}