enum SortTypes { PRICE = "price"}
export class MarketManipulator {
  static orders:Order[] = [];
  static look(r:ResourceConstant | undefined = undefined, t:string | undefined = undefined) {
    if (r == undefined && t == undefined) MarketManipulator.orders = Game.market.getAllOrders();
    else if (r != undefined && t == undefined) MarketManipulator.orders = Game.market.getAllOrders({resourceType: r});
    else if (r == undefined && t != undefined && (t == ORDER_SELL || t == ORDER_BUY)) MarketManipulator.orders = Game.market.getAllOrders({type: t});
    else if (t == ORDER_SELL || t == ORDER_BUY) MarketManipulator.orders = Game.market.getAllOrders({type: t, resourceType: r});
    else throw "Order type is not \"sell\" or \"buy\".";
    return 0;
  }
  static sort(t:SortTypes){
    switch(t){
      case SortTypes.PRICE: MarketManipulator.orders.sort((a, b) => b.price - a.price);
    }
    return 0;
  }
  static marketSell(r:ResourceConstant, t:any) {
    if (Game.rooms[t].terminal != undefined) t = Game.rooms[t].terminal;
    else return -1; //throw "No terminal was found in room [" + t + "]";
    MarketManipulator.look(r, ORDER_BUY);
    MarketManipulator.sort(SortTypes.PRICE);
    var spent:number = 0;
    var totalFees:number = 0
    var i:number = 0;
    const toSpend:number = t.store.getUsedCapacity(r);
    while (spent < toSpend && MarketManipulator.orders[i] != undefined) {
      const amount:number = Math.min(MarketManipulator.orders[i].remainingAmount, toSpend -spent);
      const fees:number = Game.market.calcTransactionCost(amount, t.room.name, MarketManipulator.orders[i].roomName!);
      if (totalFees + fees > t.store.getUsedCapacity(RESOURCE_ENERGY)) return -5;
      Game.market.deal(MarketManipulator.orders[i].id, amount, t.room.name);
      spent += amount;
      totalFees += fees;
      i++;
      if (i == 10) break; //No more than 10 orders per tick
    }
    return 0;
  }
  static print(){
    console.log("Current Market View");
    for (var i = 0; i < MarketManipulator.orders.length; i++) console.log("[" + MarketManipulator.orders[i].id + "] " + MarketManipulator.orders[i].type + " " + MarketManipulator.orders[i].resourceType + " - " + MarketManipulator.orders[i].remainingAmount + " <" + MarketManipulator.orders[i].price + ">");
    return 0;
  }
}
