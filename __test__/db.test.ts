import { db } from "../src/utils/db";
import * as schema from "../src/schema";
import { eq } from "drizzle-orm";

// Create a mock builder that maintains chainability
const createMockQueryBuilder = (mockResult: any) => {
  const mock = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(mockResult),
    then: jest.fn().mockImplementation((callback) => Promise.resolve(mockResult).then(callback))
  };
  return mock;
};

// Mock the database module
jest.mock("../src/utils/db", () => {
  return {
    db: {
      insert: jest.fn(),
      select: jest.fn(),
      from: jest.fn(),
      where: jest.fn(),
    },
    pool: {
      connect: jest.fn(),
      end: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe("Database Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Table", () => {
    test("should insert and retrieve a user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        googleid: "12345"
      };

      // Setup mock for insert
      const insertMock = createMockQueryBuilder([mockUser]);
      (db.insert as jest.Mock).mockReturnValue(insertMock);

      // Setup mock for select
      const selectMock = createMockQueryBuilder([mockUser]);
      (db.select as jest.Mock).mockReturnValue(selectMock);

      // Perform insert
      const [insertedUser] = await db.insert(schema.user)
        .values({
          email: mockUser.email,
          name: mockUser.name,
          googleid: mockUser.googleid
        })
        .returning();

      expect(insertedUser).toEqual(mockUser);

      // Perform select
      const users = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, mockUser.email));

      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(mockUser);

      // Verify mocks were called
      expect(db.insert).toHaveBeenCalled();
      expect(insertMock.values).toHaveBeenCalled();
      expect(insertMock.returning).toHaveBeenCalled();
    });
  });
  
  afterAll(() => {
    jest.resetModules();
  });
});