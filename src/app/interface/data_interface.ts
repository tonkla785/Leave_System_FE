export interface ApiResponse<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}

export interface User {
  Id?: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userDepartment: string;
}

export interface LeaveType {
  Id?: number ;
  typeName: string;
  typeDescription: string;
  maxDay?:number;
}

export interface LeaveRequest {
  Id?: number;
  startDate?: Date;
  endDate?: Date;
  leaveStatus: string;
  leaveReason: string;
  user: User;
  leaveTypeEntity: LeaveType;
}

export interface LeaveBalance {
  Id?: number;
  leaveYear?: number;
  remainDay?: number;
  
}

export interface BodyBalance {
  userId: number;
  leaveTypeId: number;
  year: number;
  remainDay:number;
}
