import { IBuyerAuctionResponse } from './IBuyerAuctionResponse';

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    getRunningAuctions(): Promise<IBuyerAuctionResponse>

}
