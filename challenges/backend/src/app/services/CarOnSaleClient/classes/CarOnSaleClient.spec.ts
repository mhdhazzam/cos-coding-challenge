
import { expect } from 'chai';
import { afterEach } from 'mocha';
import { stub, SinonStub } from 'sinon';
import { fakeBuyerAuctionsResponse } from '../../../helpers/Faker';
import { CarOnSaleClient } from './CarOnSaleClient';

const carOnSaleClient = new CarOnSaleClient();

const UNAUTHORIZED_INVALID_TOKEN_MESSAGE = 'Authentifizierung für Benutzer \"salesman@random.com\" nicht mit dem gegebenen Token möglich!"';
const UNAUTHORIZED_UNKNOWN_USER_MESSAGE = 'Authentisierung für Benutzer \"unknown\" fehlgeschlagen.';

describe('CarOnSaleClient class test', () => {
  describe('getRunningAuctions function tests', () => {
    let getRunningAuctionsFunc: SinonStub<[], Promise<any>>;
    afterEach('Reset getRunningAuctions', () => {
      getRunningAuctionsFunc.restore();
    })

    it('Should return Unauthorize status code with invalid token message when invalid token passed', async () => {
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 401, body: { message: UNAUTHORIZED_INVALID_TOKEN_MESSAGE}});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 401);
      expect(res).to.have.property('body').to.have.property('message', UNAUTHORIZED_INVALID_TOKEN_MESSAGE);
    })

    it('Should return Unauthorize status code with unknown user message when the request does not contains any auth header', async () => {
      getRunningAuctionsFunc =  stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 401, body: { message: UNAUTHORIZED_UNKNOWN_USER_MESSAGE}});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 401);
      expect(res).to.have.property('body').to.have.property('message', UNAUTHORIZED_UNKNOWN_USER_MESSAGE);
    })

    it('Should return the list of running auctions', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 3);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject, page: 1, total: responseObject.length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array');
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', responseObject.length).to.be.an('number');
      const item = res.body.items.find((item: { id: number; }) => item.id === responseObject[1].id);
      expect(item).to.have.property('id');
      expect(item).to.have.property('label');
      expect(item).to.have.property('state');
      expect(item).to.have.property('sellerType');
      expect(item).to.have.property('endingTime');
      expect(item).to.have.property('hotBid');
      expect(item).to.have.property('isLive');
      expect(item).to.have.property('sellerAccount');
      expect(item).to.have.property('associatedVehicle');

    })
    it('Should return the total when pass "count = true" as query parameter', async () => {
      getRunningAuctionsFunc =  stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: [], page: 1, total: 32 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array');
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total').to.be.an('number');
    })
  });
});
