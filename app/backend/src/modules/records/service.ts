import { prisma } from "@repo/db";
import { status } from "elysia";
import type { RecordsModel } from "./model";

const recordInclude = {
  reporter: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  },
  claim: {
    select: {
      id: true,
      claimer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      createdAt: true,
    },
  },
  image: {
    select: {
      id: true,
      imgUrl: true,
    },
  },
};

export abstract class Records {
  static async getRecord(id: string): Promise<RecordsModel.record> {
    const record = await prisma.record
      .findFirstOrThrow({
        where: {
          id,
        },
        include: recordInclude,
      })
      .catch(() => {
        throw status(
          404,
          "Record not found" satisfies RecordsModel.recordNotFound["message"]
        );
      });
    return record;
  }

  static async getRecords({
    q,
    claimed = false,
    foundLocation,
    foundSince,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
  }: RecordsModel.recordsQuery): Promise<RecordsModel.recordsPagination> {
    const offset = (page - 1) * limit;

    const records = await prisma.record.findMany({
      where: {
        ...(q && { itemName: { contains: q, mode: "insensitive" } }),
        ...(foundLocation && { foundLocation }),
        ...(foundSince && {
          foundAt: {
            gt: foundSince,
          },
        }),

        claimed,
      },
      orderBy: {
        [sort]: order,
      },

      include: recordInclude,
      take: limit,
      skip: offset,
    });

    return {
      page,
      limit,
      records: records || [],
    };
  }

  static async createRecord(
    body: RecordsModel.createRecordBody,
    userId: string
  ): Promise<RecordsModel.record> {
    const { imgUrl, ...recordData } = body;

    const record = await prisma.$transaction(async (tx) => {
      const record = await tx.record.create({
        data: {
          ...recordData,
          reporterId: userId,
          claimed: false,
        },
      });

      // Create Image
      await tx.lostItemImage.create({
        data: {
          recordId: record.id,
          imgUrl: body.imgUrl,
        },
      });

      // Return the newly created record with related data
      const newRecord = await tx.record.findUniqueOrThrow({
        where: { id: record.id },
        include: recordInclude,
      });
      return newRecord;
    });

    return record;
  }

  static async editRecord(
    recordId: string,
    body: RecordsModel.editRecordBody,
    userId: string
  ): Promise<RecordsModel.record> {
    const { imgUrl, ...recordData } = body;

    const record = await prisma.record.findUnique({
      where: {
        id: recordId,
      },
      select: {
        id: true,
        reporterId: true,
      },
    });

    if (!record)
      throw status(
        404,
        "Record not found" satisfies RecordsModel.recordNotFound["message"]
      );
    if (record?.reporterId !== userId)
      throw status(
        403,
        "No permission" satisfies RecordsModel.noPermission["message"]
      );

    const newRecord = await prisma.$transaction(async (tx) => {
      // Update image
      if (imgUrl) {
        await tx.lostItemImage.update({
          where: {
            recordId: record.id,
          },
          data: {
            imgUrl,
          },
        });
      }

      // Update record
      const newRecord = await tx.record.update({
        where: {
          id: recordId,
        },
        data: {
          ...recordData,
        },
        include: recordInclude,
      });
      return newRecord;
    });

    return newRecord;
  }

  static async deleteRecord(recordId: string, userId: string) {
    const record = await prisma.record.findUnique({
      where: {
        id: recordId,
      },
      select: {
        reporterId: true,
      },
    });

    if (!record)
      throw status(
        404,
        "Record not found" satisfies RecordsModel.recordNotFound["message"]
      );
    if (record?.reporterId !== userId)
      throw status(
        403,
        "No permission" satisfies RecordsModel.noPermission["message"]
      );

    await prisma.record.delete({
      where: {
        id: recordId,
      },
    });

    return;
  }

  static async claimRecord(recordId: string, userId: string) {
    const record = await prisma.record.findUnique({
      where: {
        id: recordId,
      },
      include: {
        claim: true,
      },
    });

    if (!record)
      throw status(
        404,
        "Record not found" satisfies RecordsModel.recordNotFound["message"]
      );

    // Unclaim
    if (record.claim) {
      if (record.claim.claimerId !== userId)
        throw status(
          403,
          "No permission" satisfies RecordsModel.noPermission["message"]
        );

      await prisma.$transaction([
        // Delete claim
        prisma.claim.delete({
          where: {
            id: record.claim.id,
          },
        }),

        // Update record claimed -> false
        prisma.record.update({
          where: {
            id: recordId,
          },
          data: {
            claimed: false,
          },
        }),
      ]);

      return false;
    }

    // Claim
    else {
      await prisma.$transaction([
        // Create new claim
        prisma.claim.create({
          data: {
            recordId,
            claimerId: userId,
          },
        }),

        // Update record claimed -> true
        prisma.record.update({
          where: {
            id: recordId,
          },
          data: {
            claimed: true,
          },
        }),
      ]);

      return true;
    }
  }
}
