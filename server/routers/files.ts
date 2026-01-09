import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createFile, deleteFile, getUserFiles, getFileById } from "../db";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const filesRouter = router({
  /**
   * List all files for the authenticated user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userFiles = await getUserFiles(ctx.user.id);
      return userFiles;
    } catch (error) {
      console.error("[Files] Failed to list files:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list files",
      });
    }
  }),

  /**
   * Upload a file to S3 and store metadata in database
   */
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileData: z.string(), // Base64 encoded file data
        mimeType: z.string().min(1).max(100),
        fileSize: z.number().positive(),
        description: z.string().optional(),
        tags: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate file size (max 50MB)
        const MAX_FILE_SIZE = 50 * 1024 * 1024;
        if (input.fileSize > MAX_FILE_SIZE) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size exceeds 50MB limit",
          });
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(input.fileData, "base64");

        // Generate unique file key with random suffix to prevent enumeration
        const randomSuffix = nanoid(8);
        const fileKey = `${ctx.user.id}-files/${input.fileName}-${randomSuffix}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, fileBuffer, input.mimeType);

        // Store metadata in database
        const result = await createFile({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileKey,
          url,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          description: input.description || null,
          tags: input.tags || null,
        });

        return {
          success: true,
          fileKey,
          url,
        };
      } catch (error) {
        console.error("[Files] Failed to upload file:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }
    }),

  /**
   * Delete a file from S3 and database
   */
  delete: protectedProcedure
    .input(
      z.object({
        fileId: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify file belongs to user
        const file = await getFileById(input.fileId, ctx.user.id);
        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found",
          });
        }

        // Delete from database
        const deleted = await deleteFile(input.fileId, ctx.user.id);

        if (!deleted) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete file",
          });
        }

        return {
          success: true,
          message: "File deleted successfully",
        };
      } catch (error) {
        console.error("[Files] Failed to delete file:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),

  /**
   * Get details of a specific file
   */
  get: protectedProcedure
    .input(
      z.object({
        fileId: z.number().positive(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const file = await getFileById(input.fileId, ctx.user.id);
        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found",
          });
        }
        return file;
      } catch (error) {
        console.error("[Files] Failed to get file:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get file",
        });
      }
    }),
});
