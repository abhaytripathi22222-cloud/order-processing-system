import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProcessedEventRepository {

  async find(eventId:string){

    return prisma.processedEvent.findUnique({
      where:{
        eventId
      }
    });

  }


  async create(
    eventId:string,
    eventType:string
  ){

    return prisma.processedEvent.create({
      data:{
        eventId,
        eventType
      }
    });

  }

}