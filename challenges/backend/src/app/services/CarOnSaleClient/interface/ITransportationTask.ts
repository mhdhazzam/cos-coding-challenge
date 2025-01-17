export interface ITransportationTask {
    id: number;
    netPrice: number;
    grossPrice: number;
    state: number;
    _fk_associatedAuction: number;
    _fk_associatedBuyer: number;
    createdAt: Date;
    updatedAt: Date;
    distanceInKm: number;
    internalNetPrice: number;
    bookedAt?: Date | null;
    _fk_transportationProvider?: number | null;
    assignedAt?: Date | null;
    urlToHandoverProtocolDocument?: string | null;
    discountedNetPrice: number;
    invoiceReference?: unknown;
    _fk_uuid_auction?: string | null;
    _fk_uuid_buyerUser?: string | null;
    _fk_uuid_transportationProvider?: string | null;
    uuid?: string | null;
    earliestPickupDate?: Date | null;
    note?: string | null;
    _fk_associatedSeller?: number | null;
    _fk_uuid_sellerUser?: string | null;
    _fk_associatedVehicle?: number | null;
    _fk_uuid_associatedVehicle?: string | null;
    urlToSignedPickUpAuthorizationDocument?: string | null;
    estimatedPickupDate?: Date | null;
    estimatedDeliveryDate?: Date | null;
    deletedAt?: Date | null;
}