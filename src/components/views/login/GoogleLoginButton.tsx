import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
  const handleGoogleLogin = async (credential: string) => {
    console.log(credential, "credentail");
    const res = await axios.post(
      "http://localhost:8333/api/auth/login/google",
      credential
    );

    if (res) {
      localStorage.setItem("token", res.data);
      console.log(res, "google login res");
    }
  };
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          "33257021890-oi8anu7gobv0qg1g1r7ohud3b98p3ru1.apps.googleusercontent.com"
        }
      >
        <GoogleLogin
          onSuccess={(res) => {
            if (res && res.credential) {
              handleGoogleLogin(res.credential);
            }
          }}
        />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleLoginButton;
