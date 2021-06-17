import { IBuyerAuction } from './IBuyerAuction';

export interface IBuyerAuctionResponse {
  items: IBuyerAuction[];
  page: number;
  total: number;
}