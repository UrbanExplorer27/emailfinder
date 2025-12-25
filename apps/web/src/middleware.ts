import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/signin(.*)", "/signup(.*)", "/forgot-password", "/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};

