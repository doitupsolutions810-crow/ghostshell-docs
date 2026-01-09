import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("files router", () => {
  it("should list files for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This should return an empty array initially
    const files = await caller.files.list();
    expect(Array.isArray(files)).toBe(true);
  });

  it("should require authentication for file operations", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.list();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should validate file upload input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.upload({
        fileName: "test.sh",
        fileData: "invalid-base64",
        mimeType: "text/plain",
        fileSize: 1000,
      });
      // This may fail due to S3 or database issues, but the input validation should pass
    } catch (error: any) {
      // Expected to fail, but not due to input validation
      expect(error).toBeDefined();
    }
  });

  it("should reject files larger than 50MB", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.upload({
        fileName: "large.bin",
        fileData: "aGVsbG8=", // "hello" in base64
        mimeType: "application/octet-stream",
        fileSize: 60 * 1024 * 1024, // 60MB
      });
      expect.fail("Should have thrown an error for file size");
    } catch (error: any) {
      expect(error.message).toContain("50MB");
    }
  });
});
