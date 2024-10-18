import { OAuth2Client } from "google-auth-library";
import mysql from "mysql2/promise";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID); // Your Google Client ID here

export default async function validateToken(req, res) {
  const authHeader = req.headers.authorization;
  const connection = await mysql.createConnection({
    host: "host.docker.internal",
    user: "root",
    password: "password",
    database: "lingoLoop",
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "No token provided" });
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
    const userName = payload?.name;
    const userEmail = payload?.name;

    // If new user: Add user to database
    const [existingUser] = await connection.execute(
      `SELECT * FROM users WHERE googleId=${userId}`,
    );

    if (existingUser.length === 0) {
      await connection.execute(
        "INSERT INTO users (googleId, name, email) VALUES (?, ?, ?)",
        [userId, userName, userEmail],
      );
    }
    await connection.end();

    res.status(200).json({ valid: true, userId: userId, name: userName });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
