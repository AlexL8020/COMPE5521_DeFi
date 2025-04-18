// In a types.ts file or directly in your component
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      address?: string | null;
    };
  }
}
