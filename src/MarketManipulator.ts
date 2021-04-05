enum SortTypes { PRICE = "price"}
export class MarketManipulator {
  static orders:Order[] = [];
  static marketView(r:ResourceConstant | undefined = undefined, t:string | undefined = undefined) {
    if (r == undefined && t == undefined) MarketManipulator.orders = Game.market.getAllOrders();
    else if (r != undefined && t == undefined) MarketManipulator.orders = Game.market.getAllOrders({resourceType: r});
    else if (r == undefined && t != undefined && (t == ORDER_SELL || t == ORDER_BUY)) MarketManipulator.orders = Game.market.getAllOrders({type: t});
    else if (t == ORDER_SELL || t == ORDER_BUY) MarketManipulator.orders = Game.market.getAllOrders({type: t, resourceType: r});
    else throw "Order type is not \"sell\" or \"buy\".";
    return 0;
  }
  static sortView(t:SortTypes){
    switch(t){
      case SortTypes.PRICE: MarketManipulator.orders.sort((a, b) => b.price - a.price);
    }
    return 0;
  }
  static buyFilter(){
    const o:Order[] = _.cloneDeep(MarketManipulator.orders);
    MarketManipulator.orders = [];
    for (var i = 0; i < o.length; i++) if (o[i].type == ORDER_BUY) MarketManipulator.orders.push(o[i]);
    return 0;
  }
  static marketSell(r:ResourceConstant, t:any) {
    if (typeof t != typeof "" || StructureTerminal) return -2; //throw "t can only be a room name or terminal.";
    if (typeof t == typeof "") {
      if (Game.rooms[t].terminal != undefined) t = Game.rooms[t].terminal;
      else return -1; //throw "No terminal was found in room [" + t + "]";
    }
    MarketManipulator.marketView(r, ORDER_BUY);
    MarketManipulator.sortView(SortTypes.PRICE);
    if (MarketManipulator.orders[0] != undefined) Game.market.deal(MarketManipulator.orders[0].id, Math.min(MarketManipulator.orders[0].remainingAmount, t.store.getUsedCapacity(r)), t.room.name);
    return 0;
  }
  static print(){
    console.log("Current Market View");
    for (var i = 0; i < MarketManipulator.orders.length; i++) console.log("[" + MarketManipulator.orders[i].id + "] " + MarketManipulator.orders[i].type + " " + MarketManipulator.orders[i].resourceType + " - " + MarketManipulator.orders[i].remainingAmount + " <" + MarketManipulator.orders[i].price + ">");
    return 0;
  }
}
