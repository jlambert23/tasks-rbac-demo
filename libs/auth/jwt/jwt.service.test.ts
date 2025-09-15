import { JwtService, CustomJwtPayload } from "./jwt.service";
import { UserContext } from "@tasks/data";

describe("JwtService", () => {
  let jwtService: JwtService;
  let mockUser: UserContext;

  beforeEach(() => {
    jwtService = new JwtService();
    mockUser = {
      id: 1,
      role: {
        id: 1,
        name: "admin",
        description: "Admin role",
        children: [],
      },
    };
  });

  describe("generateToken", () => {
    it("generates a valid JWT token", () => {
      const token = jwtService.generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("includes user id and role in token payload", () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload!.sub).toBe(mockUser.id);
      expect(payload!.role).toBe(mockUser.role.name);
    });
  });

  describe("verifyToken", () => {
    it("verifies a valid token", () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload!.sub).toBe(1);
      expect(payload!.role).toBe("admin");
    });

    it("returns null for invalid token", () => {
      const payload = jwtService.verifyToken("invalid.token.here");
      expect(payload).toBeNull();
    });

    it("returns null for malformed token", () => {
      const payload = jwtService.verifyToken("not-a-jwt");
      expect(payload).toBeNull();
    });
  });

  describe("extractTokenFromHeader", () => {
    it("extracts token from Bearer header", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
      const authHeader = `Bearer ${token}`;

      const extracted = jwtService.extractTokenFromHeader(authHeader);
      expect(extracted).toBe(token);
    });

    it("returns null for non-Bearer header", () => {
      const extracted = jwtService.extractTokenFromHeader(
        "Basic username:password"
      );
      expect(extracted).toBeNull();
    });

    it("returns null for empty header", () => {
      const extracted = jwtService.extractTokenFromHeader("");
      expect(extracted).toBeNull();
    });

    it("returns null for malformed Bearer header", () => {
      const extracted = jwtService.extractTokenFromHeader("Bearer");
      expect(extracted).toBeNull();
    });
  });
});
