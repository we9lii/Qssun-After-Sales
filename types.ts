export enum UserRole {
  TECHNICIAN = 'TECHNICIAN',
  MANAGER = 'MANAGER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  username?: string; // Added for login
  password?: string; // Added for login
  phone?: string;    // Added for contact
}

export interface GeoLocation {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
}

export interface Report {
  id: string;
  technicianId: string;
  technicianName: string;
  customerName: string;
  customerPhone: string;
  projectSize: string; // Changed from projectName to projectSize
  maintenanceType: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  location: GeoLocation | null;
  photoBefore: string[] | null;
  photoAfter: string[] | null;
  // New dynamic parameters structure
  voltageReadings: Record<string, string>;
  notes: string;
  customerSignature: string | null; // Base64
  createdAt: string;
  photoVoltage?: string[] | null;
  photoCurrent?: string[] | null;
  photoFrequency?: string[] | null;
  photoSpeed?: string[] | null;
  photoInverter?: string[] | null;
  photoWorkTable?: string[] | null;
  updateName?: string;
  updateType?: string;
  status: 'pending' | 'completed' | 'approved';
}

export const MOCK_USERS: User[] = [
  {
    id: 'tech_faisal_m',
    name: 'فيصل محمد',
    role: UserRole.TECHNICIAN,
    username: 'we9l',
    password: '1',
    phone: '0500000001',
    avatar: 'https://ui-avatars.com/api/?name=Faisal+Mohammed&background=0D9488&color=fff&bold=true'
  },
  {
    id: 'mgr_faisal_n',
    name: 'فيصل النتيفي',
    role: UserRole.MANAGER,
    username: 'we9li',
    password: '1',
    phone: '0500000002',
    avatar: 'https://ui-avatars.com/api/?name=Faisal+Alnutaifi&background=4F46E5&color=fff&bold=true'
  },
];