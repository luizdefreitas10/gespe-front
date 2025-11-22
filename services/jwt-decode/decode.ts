import jwt from "jsonwebtoken";

type TokenProps = {
  sub: string;
  role: "ADMIN" | "GESTOR" | " USER";
  iat: number;
  // permissions: string[];
};

export function decodeToken(token: string): TokenProps | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as TokenProps;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
