import { User, ParticipantRequest } from './core-api';

export interface RequestView {
  id: number;
  crisisId: number;
  user: User;
  address: {
    firstLineOfAddress: string;
    secondLineOfAddress: string;
  };
  phone: string;
  isMedicineRequest: boolean;
  isGroceryRequest: boolean;
  requests: ParticipantRequest[];
}
