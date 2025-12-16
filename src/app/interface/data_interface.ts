export interface ApiResponse<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}

export interface User {
  id?: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userDepartment: string;
}

export interface LeaveType {
  id?: number;
  typeName: string;
  typeDescription: string;
  maxDay?: number;
}

export interface LeaveRequest {
  id?: number;
  startDate?: Date;
  endDate?: Date;
  leaveStatus: string;
  leaveReason: string;
  user: User;
  leaveTypeEntity: LeaveType;

  dayDiff?: number;
}

export interface LeaveBalance {
  id?: number;
  leaveYear?: number;
  remainDay?: number;
}

export interface BodyBalance {
  userId: number;
  leaveTypeId: number;
  year: number;
  remainDay: number;
}

export interface DataFromDashBoard {
  maxDay: number;
  sumLeaveDay: number;
  remainDay: number;
}

export interface PayloadRequest {
  userId?: number;
  leaveTypeId?: number;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
}
