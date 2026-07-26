export interface ChannelConnection {
  id: string;
  organizationId: string;
  provider?: string;
  status?: string;
  externalAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}
