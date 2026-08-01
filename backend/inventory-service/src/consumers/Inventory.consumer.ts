import { getChannel } from "../config/rabbitmq";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function startInventoryConsumer() {

  const channel = getChannel();


  channel.consume("inventory.queue", async (msg: any) => {

    if (!msg) return;


    try {

      const routingKey = msg.fields.routingKey;

      const order = JSON.parse(
        msg.content.toString()
      );


      console.log("================================");
      console.log("📦 EVENT RECEIVED");
      console.log("Routing:", routingKey);
      console.log(order);
      console.log("================================");


      switch(routingKey) {


        case "order.created":
          // throw new Error("Testing Retry");

          await reserveInventory(order);

          break;


        case "inventory.release":

          await releaseInventory(order);

          break;


        default:

          console.log(
            "Unknown event:",
            routingKey
          );

      }


      channel.nack(msg, false, false);


    } catch (error: any) {

  console.error("❌ Inventory Error:", error.message);

const retryCount =
  (msg.properties.headers?.["x-retry-count"] as number) || 0;

  if (retryCount < 3) {

    channel.publish(
      "retry-exchange",
      "inventory.retry",
      msg.content,
      {
        persistent: true,

     headers: {
  "x-retry-count": retryCount + 1,
},
      }
    );

    console.log(`🔄 Retry ${retryCount + 1}/3`);

  } else {

    channel.nack(msg, false, false);

    console.log("💀 Max retries reached. Sent to DLQ.");

    return;
  }

  channel.ack(msg);
}

  });


  console.log("👂 Inventory Consumer Started");

}




async function reserveInventory(order:any){

  const inventory =
    await prisma.inventory.findUnique({
      where:{
        sku: order.sku
      }
    });


  if(!inventory){
    throw new Error("Product not found");
  }


  if(inventory.quantity < order.quantity){
    throw new Error("Insufficient stock");
  }


  await prisma.inventory.update({

    where:{
      id: inventory.id
    },

    data:{

      quantity:{
        decrement: order.quantity
      },

      reserved:{
        increment: order.quantity
      }

    }

  });


  console.log("✅ Inventory Reserved");


  getChannel().publish(

    "order-exchange",

    "inventory.reserved",

    Buffer.from(
      JSON.stringify(order)
    ),

    {
      persistent:true
    }

  );


  console.log(
    "📤 inventory.reserved published"
  );

}




async function releaseInventory(order:any){


  console.log("♻ Releasing Inventory");
  console.log(order);


  if(!order.sku){
    throw new Error(
      "SKU missing in inventory.release event"
    );
  }


  const inventory =
    await prisma.inventory.findUnique({

      where:{
        sku: order.sku
      }

    });



  if(!inventory){

    throw new Error(
      "Product not found"
    );

  }



  await prisma.inventory.update({

    where:{
      id: inventory.id
    },


    data:{

      quantity:{
        increment: order.quantity
      },


      reserved:{
        decrement: order.quantity
      }

    }

  });



  console.log(
    "♻ Inventory Released"
  );



  getChannel().publish(

    "order-exchange",

    "inventory.released",

    Buffer.from(
      JSON.stringify(order)
    ),

    {
      persistent:true
    }

  );


  console.log(
    "📤 inventory.released published"
  );

}