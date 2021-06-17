import { inject, injectable } from "inversify";
import { get } from 'config';
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from './services/CarOnSaleClient/interface/ICarOnSaleClient';

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CarOnSaleClient) private carOnSaleClient: ICarOnSaleClient) {
    }

    public async start(): Promise<void> {
        this.logger.log(`Auction Monitor started.`);
        this.logger.log(`Retrieve auctions for ${get('userCredentials.emailId')}...`);
        const buyerAuctions = await this.carOnSaleClient.getRunningAuctions();
        this.logger.result(`Number Of Auctions: ${buyerAuctions.total}`);
        console.log('======================')
        buyerAuctions.items.forEach((buyerAuction) => {
            this.logger.log(`id: ${buyerAuction.id} ${buyerAuction.label}`);
            this.logger.result(`Number Of Bids: ${buyerAuction.numBids}`)
            this.logger.result(`Average Percentage Of The Auction Progress: ${(buyerAuctions.items[0].currentHighestBidValue / buyerAuctions.items[0].minimumRequiredAsk).toFixed(3)}`);
            console.log('======================')
        });
        process.exit(0);
    }

}
