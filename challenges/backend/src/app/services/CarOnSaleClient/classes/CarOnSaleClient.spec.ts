
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

    it('Should return the total filtered by "isLive = true" when pass "count = true and filter = {isLive: true}" as query parameter', async () => {
      getRunningAuctionsFunc =  stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: [], page: 1, total: 0 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array');
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 0).to.be.an('number');
    })

    it('Should return the items filtered by "isLive = true" when pass "filter = {isLive: true}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 3);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: [], page: 1, total: 0 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(0);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', responseObject.filter(res => res.isLive).length).to.be.an('number');
    })

    it('Should return the items filtered by "ids" when pass "filter = {ids: [#,#]}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 1);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject, page: 1, total: 1 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(1);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 1).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[0].id);
    })

    it('Should return the items filtered by "sellerAccounts" when pass "filter = {sellerAccounts: {uuids: ["##"]}}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 4);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i === 1), page: 1, total: 1 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(1);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 1).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[1].id);
      expect(res.body.items[0].sellerAccount.uuid).is.equal(responseObject[1].sellerAccount.uuid);
    })

    it('Should return the items filtered by "uuids" when pass "filter = {uuids: [#,#]}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 2);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i === 1), page: 1, total: 1 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(1);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 1).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[1].id);
      expect(res.body.items[0].uuid).is.equal(responseObject[1].uuid);
    })

    it('Should return the items filtered by "vehicleSearchQuery(by vim)" when pass "filter = {vehicleSearchQuery: {vin: "#"}}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 5);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i === 2), page: 1, total: 1 }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(1);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 1).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[2].id);
      expect(res.body.items[0].associatedVehicle.vin).is.equal(responseObject[2].associatedVehicle.vin);
    })

    it('Should return the items filtered by "paymentProcesses" when pass "filter = {paymentProcesses: [#]}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 5);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject, page: 1, total: responseObject.length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(5);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 5).to.be.an('number');
      const items = res.body.items.filter((item: { paymentProcess: number; }) => item.paymentProcess === 0);
      expect(items.length).is.equal(responseObject.length);
    })

    it('Should return the "N" items when passing "filter = {limit: N}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 3);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i < 2), page: 1, total: responseObject.length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(2);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 3).to.be.an('number');
    })

    it('Should return the items starting from "N" item when passing "filter = {offset: N}" as query parameter', async () => {
      const responseObject = fakeBuyerAuctionsResponse({} , 5);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i >= 2), page: 1, total: responseObject.length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(3);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', responseObject.length).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[2].id);
    })

    it('Should return the items starting from "N" and update the "page" property when passing "filter = {offset: N, limit: S}" as query parameter', async () => {
      const offset = 5;
      const limit = 5;
      const responseObject = fakeBuyerAuctionsResponse({} , offset * 3);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter((_,i) => i >= offset && i < offset + limit), page: (offset/limit)+1, total: responseObject.length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(limit);
      expect(res).to.have.property('body').to.have.property('page', 2).to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', responseObject.length).to.be.an('number');
      expect(res.body.items[0].id).is.equal(responseObject[5].id);
      expect(res.body.items[limit-1].id).is.equal(responseObject[limit+offset-1].id);
    })

    it('Should return the items filtered by "distance" when pass "filter = {distance: { radius: ## }}" as query parameter', async () => {
      const distance = 100;
      const responseObject = fakeBuyerAuctionsResponse({ distance } , 5);
      getRunningAuctionsFunc = stub(carOnSaleClient, 'getRunningAuctions').returns(new Promise((resolve => {
        resolve({ status: 200, body: { items: responseObject.filter(item => item.distanceToVehicleInKms <= distance * 2), page: 1, total: responseObject.filter(item => item.distanceToVehicleInKms <= distance * 2).length }});
      })));
      const res = await carOnSaleClient.getRunningAuctions();
      expect(getRunningAuctionsFunc.calledOnce).to.be.true;
      expect(res).to.have.property('status', 200);
      expect(res).to.have.property('body').to.have.property('items').to.be.an('array').length(1);
      expect(res).to.have.property('body').to.have.property('page').to.be.an('number');
      expect(res).to.have.property('body').to.have.property('total', 1).to.be.an('number');
      expect(res.body.items[0]).to.have.property('distanceToVehicleInKms', responseObject.find(item => item.distanceToVehicleInKms <= distance*2)?.distanceToVehicleInKms);
    })
  });
});
