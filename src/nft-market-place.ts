import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketPlace/NftMarketPlace"
import { ItemBought, ItemCanceled, ItemListed, ActiveItem } from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  // let entity = new ItemBought(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )

  let entity = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItemEntity = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if (!entity) {
    entity = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }

  // ItemboughtObject parameters
  entity.buyer = event.params.buyer
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  // ActiveItem object parameters
  activeItemEntity!.buyer = event.params.buyer;

  entity.save()
  activeItemEntity!.save()

}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  // let entity = new ItemCanceled(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )

  let entity = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItemEntity = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if (!entity) {
    entity = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }

  // if (!activeItemEntity) {
  //   activeItemEntity = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));  
  // }

  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  activeItemEntity!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD");


  entity.save()
  activeItemEntity!.save();
}

export function handleItemListed(event: ItemListedEvent): void {

  let entity = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItemEntity = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if (!entity) {
    entity = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));  
  }

  if (!activeItemEntity) {
    activeItemEntity = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));  
  }

  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  activeItemEntity.seller = event.params.seller;
  activeItemEntity.nftAddress = event.params.nftAddress;
  activeItemEntity.tokenId = event.params.tokenId;
  activeItemEntity.price = event.params.price;
  activeItemEntity.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

  entity.save()
  activeItemEntity.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}