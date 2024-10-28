import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuth(async function middleware(req: any) {
  console.log("look at me", req.kindeAuth);
});

export const config = {
  matcher: ["/admin"]
};