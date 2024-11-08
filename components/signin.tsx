import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import Cookies from "js-cookie";
import { Spacer } from "@nextui-org/react";

export const SignIn = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  return (
    <>
      Sign in using Google Account:
      <Spacer y={1} />
      <GoogleLogin
        onError={() => {
          console.log("Login Failed");
        }}
        onSuccess={(credentialResponse) => {
          const token = credentialResponse?.credential;

          if (token) {
            Cookies.set("token", token);
            onLoginSuccess();
          } else {
            console.error("No token received");
          }
        }}
      />
    </>
  );
};
