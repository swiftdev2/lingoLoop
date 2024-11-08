import { Card, Spacer, Divider, Avatar } from "@nextui-org/react";

import { SignIn } from "./signin";

export const HomePage = ({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) => {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      {/* Hero Section */}
      <div
        style={{
          padding: "3rem 2rem",
          background: "linear-gradient(135deg, #76aae3, #6A52FF, #7d158f)",
          borderRadius: "16px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          display: "flex", // Added flexbox
          flexDirection: "column", // Stack the children vertically
          justifyContent: "center", // Vertically center the content
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>
          Welcome to Lingo Loop 🌎
        </h1>
        <h2
          style={{ fontSize: "1.5rem", fontWeight: "normal", marginTop: "0" }}
        >
          Learn languages faster with personalized flashcards
        </h2>
        <Spacer y={1} />
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.6rem",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          Join a community of language learners improving vocabulary every day.
          Lingo Loop makes language learning easier, adaptive, and fun!
        </p>
        <Spacer y={3} />
        <SignIn onLoginSuccess={onLoginSuccess} />
      </div>

      <Spacer y={2} />

      {/* Feature Overview */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", margin: "1.5rem 0", color: "#FF6E40" }}>
          Why Choose Lingo Loop?
        </h2>
        <p
          style={{
            fontSize: "1rem",
            maxWidth: "700px",
            margin: "auto",
            color: "var(--text-secondary-color, #555)",
          }}
        >
          Discover the features that make Lingo Loop the perfect companion for
          your language learning journey.
        </p>
      </div>

      <Spacer y={1.5} />

      {/* Features Section */}

      <Card
        isHoverable
        style={{
          padding: "1.5rem",
          textAlign: "center",
          background: "#FFCC80",
        }}
      >
        <Avatar
          size="lg"
          src="https://img.icons8.com/color/48/000000/book-shelf.png"
        />
        <Spacer y={0.5} />
        <h3 style={{ color: "#11181c" }}>Smart Flashcards</h3>
        <p style={{ color: "#555" }}>
          Our adaptive flashcards adjust to your progress, helping you retain
          words more effectively.
        </p>
      </Card>

      <Spacer y={2} />

      <Card
        isHoverable
        style={{
          padding: "1.5rem",
          textAlign: "center",
          background: "#80DEEA",
        }}
      >
        <Avatar
          size="lg"
          src="https://img.icons8.com/color/48/000000/edit.png"
        />
        <Spacer y={0.5} />
        <h3 style={{ color: "#11181c" }}>Custom Vocabulary</h3>
        <p style={{ color: "#555" }}>
          Create your own dictionary and group words by topic, so you can study
          what’s most important to you.
        </p>{" "}
      </Card>

      <Spacer y={2} />

      <Card
        isHoverable
        style={{
          padding: "1.5rem",
          textAlign: "center",
          background: "#FFAB91",
        }}
      >
        <Avatar
          size="lg"
          src="https://img.icons8.com/color/48/000000/brain.png"
        />
        <Spacer y={0.5} />
        <h3 style={{ color: "#11181c" }}>Focused Practice</h3>
        <p style={{ color: "#555" }}>
          Study words that challenge you the most with targeted practice to
          boost retention.
        </p>
      </Card>

      <Spacer y={2} />
      <Divider />

      {/* Final CTA */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#FF8A65" }}>
          Ready to start learning?
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary-color, #555)",
          }}
        >
          Click "Sign in with Google" above to join Lingo Loop and start
          improving your language skills today!
        </p>
      </div>
    </div>
  );
};
