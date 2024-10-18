import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function validateToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      error: "Unable to authenticate user token - please try signing in again",
    };
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Specify the client ID of your app
    });

    const payload = ticket.getPayload(); // This contains the user information (like userId, email, etc.)

    const userId = payload?.sub;

    return { valid: true, userId: userId };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid or expired token - please try signing in again",
    };
  }
}
