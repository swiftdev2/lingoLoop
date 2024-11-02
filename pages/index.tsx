import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import DefaultLayout from "@/layouts/default";
import { SignIn } from "@/components/signin";
import { QuizWords } from "@/components/wordsQuiz";

export default function IndexPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    handleLoginSuccess();
  }, []);

  const handleLoginSuccess = async () => {
    const token = Cookies.get("token");

    if (token) {
      setLoading(true);
      // If token exists, validate it by making a request to the backend
      try {
        const res = await fetch("/api/validateToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          console.log(res);
          const data = await res.json();

          Cookies.set("name", data.name);
          Cookies.set("userId", data.userId);

          setIsAuthenticated(true);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
        console.error("Token validation failed:", err);
      }
    }
  };

  console.log("isAuthenticated", isAuthenticated);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
        <GoogleOAuthProvider clientId="502508006609-fcg4pvogi9svglrt1p1s1euuuk6e6p6c.apps.googleusercontent.com">
          {isAuthenticated ? (
            <QuizWords />
          ) : error ? (
            <>
              <div>Unknown error occured, please try to log in again</div>
              <SignIn onLoginSuccess={handleLoginSuccess} />
            </>
          ) : (
            <SignIn onLoginSuccess={handleLoginSuccess} />
          )}
        </GoogleOAuthProvider>
      </section>
    </DefaultLayout>
  );
}
