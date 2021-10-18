import { Queue } from "Queue";
import { task, template } from "task";

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

  static marketSell(r:ResourceConstant, t:any, a:number = -1) {

    if (a < 100 && a >= 0) return -42;

    var temp:number = a;

    if (Game.rooms[t].terminal != undefined) t = Game.rooms[t].terminal;
    else throw "No terminal was found in room [" + t + "]";

    if (t.cooldown! > 0) { Queue.request(new MarketSell(r, t.room.name!, a)); return; }

    MarketManipulator.look(r, ORDER_BUY);
    MarketManipulator.sort(SortTypes.PRICE);

    if (a < 0) a = t.store.getUsedCapacity(r);
    const toSpend:number = Math.min(t.store.getUsedCapacity(r), a);

    if (toSpend < 100) return 0;

    if (MarketManipulator.orders[0] != undefined) {
      var amount:number = Math.min(MarketManipulator.orders[0].remainingAmount, toSpend);
      if (r == RESOURCE_ENERGY) if (amount + Game.market.calcTransactionCost(amount, t.room.name, MarketManipulator.orders[0].roomName!) > toSpend) {
        const delta = Game.market.calcTransactionCost(1000000, t.room.name, MarketManipulator.orders[0].roomName!)/1000000;
        amount = Math.floor(toSpend/(1 + delta));
      }
      Game.market.deal(MarketManipulator.orders[0].id, amount, t.room.name);
      console.log("Market Sell Order [" + MarketManipulator.orders[0].id + "] " + MarketManipulator.orders[0].type + " " + MarketManipulator.orders[0].resourceType + " - " + amount + " <" + MarketManipulator.orders[0].price + ">");
      if (r != RESOURCE_ENERGY) Queue.request(new MarketSell(r, t.room.name!, temp - amount));
      else Queue.request(new MarketSell(r, t.room.name!, temp - amount - Game.market.calcTransactionCost(amount, t.room.name, MarketManipulator.orders[0].roomName!)));
    }
    return 0;
  }

  static print(){
    console.log("Current Market View");
    for (var i = 0; i < MarketManipulator.orders.length; i++) console.log("[" + MarketManipulator.orders[i].id + "] " + MarketManipulator.orders[i].type + " " + MarketManipulator.orders[i].resourceType + " - " + MarketManipulator.orders[i].remainingAmount + " <" + MarketManipulator.orders[i].price + ">");
    return 0;
  }
}

export class MarketSell extends template implements task {
  private r:ResourceConstant;
  private t:string;
  private a:number
  constructor(r:ResourceConstant, t:string, a:number) {
    super("Market Sell");
    this.r = r;
    this.t = t;
    this.a = a;
  }
  run() {
    MarketManipulator.marketSell(this.r, this.t, this.a);
  }
}
