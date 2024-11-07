import {
  Card,
  Spacer,
  Button,
  Link,
  CardHeader,
  CardBody,
} from "@nextui-org/react";

export default function About() {
  return (
    <div>
      <Spacer y={1.5} />

      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <h2>About Lingo Loop</h2>
        </CardHeader>
        <CardBody>
          <p>
            Lingo Loop is a flashcard tool designed to make language learning
            easier through a structured and adaptive memorization process. Add
            words, organize them into groups, and get tested to build vocabulary
            effectively.
          </p>
        </CardBody>
      </Card>

      <Spacer y={4} />

      {/* Adding Words and Groups */}
      <Card>
        <CardHeader>
          <h3>Adding Words and Groups</h3>
        </CardHeader>
        <CardBody>
          <p>
            Use the <strong>Add</strong> page to enter new words into your
            personalized dictionary. Enter the English word, its translation,
            and assign it to a group (e.g., 'Colors' or 'Food') if desired. You
            can also create custom groups to organize your vocabulary for
            targeted practice.
          </p>
        </CardBody>
      </Card>

      <Spacer y={4} />

      {/* How the Flashcard Quiz Works */}
      <Card>
        <CardHeader>
          <h3>How the Flashcard Quiz Works</h3>
        </CardHeader>
        <CardBody>
          <p>
            The main flashcard page shows a card with either the English word or
            its translation. Your goal is to recall the correct translation.
            Click the card to check your answer. If correct, click the{" "}
            <Button color="success" size="sm">
              Correct
            </Button>{" "}
            button; if not, click{" "}
            <Button color="danger" size="sm">
              Wrong
            </Button>
            .
          </p>
          <p>
            Lingo Loop tracks your progress. Words answered incorrectly are
            added to an <strong>Incorrect Words List</strong> and will appear
            more frequently until you've correctly answered them correct 3 times
            in a row.
          </p>
        </CardBody>
      </Card>

      <Spacer y={4} />

      {/* Smart Algorithm and Practice Modes */}
      <Card>
        <CardHeader>
          <h3>Adaptive Practice Modes</h3>
        </CardHeader>
        <CardBody>
          <p>
            Lingo Loop adapts to your progress using a smart algorithm. When
            practicing with <strong>All Words</strong>, the system begins with a
            small set and adds new words to your{" "}
            <strong>Words Testing On List</strong> as you succeed, these come
            from your Dictionary.
          </p>
          <p>
            You can also test within specific groups (e.g., 'Colors'). Here, you
            can use the Smart Algorithm.
          </p>
          <ul>
            <li>
              <strong>Smart Algorithm:</strong> The words set starts small and
              grows as you get answers right, newer words that are added to the
              set as you get answers right are more likely to appear. Incorrect
              answers are tracked separately for each group and are more likely
              to appear for testing on just like in the default view.
            </li>
          </ul>
        </CardBody>
      </Card>

      <Spacer y={4} />

      {/* Closing / Get Started Section */}
      <Card>
        <CardBody style={{ textAlign: "center" }}>
          <h3>Ready to Start Learning?</h3>
          <p>
            Head to the{" "}
            <Link color="primary" href="/add">
              Add
            </Link>{" "}
            page to begin building your dictionary, or go straight to the
            flashcards to start practicing!
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
