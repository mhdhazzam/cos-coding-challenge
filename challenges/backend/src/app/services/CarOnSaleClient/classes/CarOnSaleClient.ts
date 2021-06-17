import axios from 'axios';
import { get } from 'config';
import { inject, injectable } from 'inversify';
import { exit } from 'process';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ILogger } from '../../Logger/interface/ILogger';
import { IBuyerAuctionResponse } from '../interface/IBuyerAuctionResponse';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger) {
  }

  async getRunningAuctions(): Promise<IBuyerAuctionResponse> {
    const AUTHENTICATION_API = `${get('baseUrl')}${get('authenticateUserApi')}${get('userCredentials.emailId')}`;
    const BUYER_AUCTIONS_API = `${get('baseUrl')}${get('getBuyerAuctionApi')}`;
    try {
      this.logger.log(`Getting access token...`);
      const { data: { token } } = await axios.put(AUTHENTICATION_API, { password: get('userCredentials.password') });
      this.logger.log('Getting access token succeed!');
      this.logger.log('Getting buyer auctions...');
      const { data } = await axios.get(BUYER_AUCTIONS_API, { headers: {
        'authtoken': token,
        'userid': get('userCredentials.emailId')
      }});
      this.logger.log('Getting buyer auctions succeed!');
      return data;
    } catch (error) {
      // handle unauthorized error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logger.error(`${JSON.stringify(error.response?.data)}`);
      }
      // handle any axios error
      if (axios.isAxiosError(error)) {
        this.logger.error(`${error.code}|${error.message}|${JSON.stringify(error.response?.data)}`);
      }
      // handle any other error
      this.logger.error(error);
      exit(-1);
    }
  }
}