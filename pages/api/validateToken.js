import { OAuth2Client } from "google-auth-library";
// import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID); // Your Google Client ID here

export default async function validateToken(req, res) {
  const authHeader = req.headers.authorization;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  // const pool = new Pool({
  //   host: "host.docker.internal",
  //   user: "postgres",
  //   password: "password",
  //   database: "lingoLoop",
  //   port: 5432,
  // });

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
    // const { rows: existingUser } = await pool.query(
    //   "SELECT * FROM users WHERE googleid = $1",
    //   [userId],
    // );

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("googleid", userId)
      .single();

    console.log("Exisitng user", existingUser);

    // record user in db if they have not logged in before
    if (existingUser === null) {
      // await pool.query(
      //   "INSERT INTO users (googleid, name, email) VALUES ($1, $2, $3)",
      //   [userId, userName, userEmail],
      // );
      const { error } = await supabase
        .from("users") // Table name in Supabase
        .insert({
          googleid: userId, // Column names in Supabase
          name: userName,
          email: userEmail,
        });

      if (error) {
        throw error; // Handle insertion error
      }
    }

    res.status(200).json({ valid: true, userId: userId, name: userName });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
