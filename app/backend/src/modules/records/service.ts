import { prisma } from "@repo/db";
import { status } from "elysia";
import type { RecordsModel } from "./model";

export abstract class Records {
  static async getRecord(id: string) {
    const record = await prisma.record
      .findFirstOrThrow({
        where: {
          id,
        },
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimer: {
                select: { id: true, name: true, email: true, image: true },
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
        },
      })
      .catch(() => {
        throw status(404, "Record not found");
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
  }: RecordsModel.recordsQuery) {
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

      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        claim: {
          select: {
            id: true,
            claimer: {
              select: { id: true, name: true, email: true, image: true },
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
      },
      take: limit,
      skip: offset,
    });

    return {
      page,
      limit,
      data: records || [],
    };
  }

  static async createRecord(
    body: RecordsModel.createRecordBody,
    userId: string
  ) {
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
      const newRecord = await tx.record.findUnique({
        where: { id: record.id },
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimer: {
                select: { id: true, name: true, email: true, image: true },
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
        },
      });
      return newRecord;
    });

    if (!record) throw status(500, "Failed to create record");

    return record;
  }

  static async editRecord(
    recordId: string,
    body: RecordsModel.editRecordBody,
    userId: string
  ) {
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

    if (!record) throw status(404, "Record not found");
    if (record?.reporterId !== userId)
      throw status(403, "You don't have permission to edit this record.");

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
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimer: {
                select: { id: true, name: true, email: true, image: true },
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
        },
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

    if (!record) throw status(404, "Record not found");
    if (record?.reporterId !== userId)
      throw status(403, "You don't have permission to delete this record.");

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

    if (!record) throw status(404, "Record not found");

    // Unclaim
    if (record.claim) {
      if (record.claim.claimerId !== userId)
        throw status(403, "You don't have permission to unclaim this record.");

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
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            claim: {
              select: {
                id: true,
                claimer: {
                  select: { id: true, name: true, email: true, image: true },
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
          },
        }),
      ]);
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
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            claim: {
              select: {
                id: true,
                claimer: {
                  select: { id: true, name: true, email: true, image: true },
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
          },
        }),
      ]);
    }
  }
}
