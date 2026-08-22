import { PlatformNotification } from '../types';

export const initialNotifications: PlatformNotification[] = [
  {
    "id": "NOTIF-001",
    "recipientRole": "Cadet",
    "title": "New CDS Full Mock Test 02 Published",
    "message": "Admin has published the advanced CDS Full Length Mock 02. Attempt now to check your national percentile!",
    "timestamp": "2024-02-20T10:00:00Z",
    "read": false,
    "type": "test"
  },
  {
    "id": "NOTIF-002",
    "recipientRole": "Cadet",
    "title": "Scorecard Published for AFCAT Mock 01",
    "message": "Your detailed step-by-step answers and explanations for AFCAT Mock 01 are now ready for review.",
    "timestamp": "2024-02-19T14:30:00Z",
    "read": true,
    "type": "result"
  },
  {
    "id": "NOTIF-003",
    "recipientRole": "Admin",
    "title": "High Cadet Exam Activity Surge",
    "message": "Over 74 cadets are currently actively writing tests across CDS and AFCAT mock portals.",
    "timestamp": "2024-02-22T09:15:00Z",
    "read": false,
    "type": "alert"
  },
  {
    "id": "NOTIF-004",
    "recipientRole": "Admin",
    "title": "New Cadet Registration",
    "message": "Cadet Vikramaditya Rathore (CADET-2024-001) enrolled in Complete Defence Pack.",
    "timestamp": "2024-02-22T08:45:00Z",
    "read": false,
    "type": "system"
  }
];
