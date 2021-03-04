import { RequestTypes } from './here-map-core';

export type UserType =
  | 'HL' // Helper - Volunteer
  | 'AF' // Affected Participant - Quarantined
  | 'AU' // Authorities
  | 'TP'; // Third party

interface Position {
  longitude: string;
  latitude: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Headers {
  normalizedNames?: any;
  lazyUpdate?: any;
}

export interface NearbyParticipantsResponse {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: NearbyParticipantsResponseBody;
}

interface NearbyParticipantsResponseBody {
  count: number;
  next?: any;
  previous?: any;
  results: NearbyParticipant[];
}

export interface HelpRequestResponse {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: Body;
}

interface Body {
  count: number;
  next?: any;
  previous?: any;
  results: HelpRequest[];
}

export interface HelpRequest {
  id: number;
  type: RequestTypes;
  deadline: string;
  description: string;
  assignee?: any;
  status: string;
  assignmentHistory: any[];
  hasIncentive?: boolean;
  createdAt: string;
}

export interface NearbyParticipant {
  id: number;
  user: User;
  position: Position;
  type: string;
  firstLineOfAddress: string;
  secondLineOfAddress: string;
  country: string;
  placeId: string;
  postCode: string;
  city: string;
  phone: string;
  crisis: number;
  requests: ParticipantRequest[];
}

export interface ParticipantRequest {
  id: number;
  type: string;
  deadline: string;
  description: string;
  assignee?: any;
  status: string;
  assignmentHistory: any[];
  createdAt: string;
}

export interface UserProfileResponseBody {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: UserProfileData;
}

export interface UserProfileData {
  id?: number;
  user: User;
  position?: Position;
  type?: string;
  firstLineOfAddress?: string;
  secondLineOfAddress?: string;
  country?: string;
  placeId?: string;
  postCode?: string;
  city?: string;
  phone: string;
  crisis?: number;
}

export interface AcceptRequestAPIParams {
  participantId: number;
  requestId: number;
  crisisId: number;
}
