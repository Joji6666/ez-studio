import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import useAuth from "./store/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { setLoginInfo } = useAuth();
  const nav = useNavigate();

  const handleGoogleLogin = async (credential: string) => {
    const res = await axios.post(
      "http://localhost:8333/api/auth/login/google",
      credential
    );

    if (res) {
      localStorage.setItem("token", res.data.token);
      setLoginInfo(res.data.userId);
      console.log(res, "google login res");
      nav("/studio");
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
          text="signin"
          theme="outline"
          shape="square"
          size="large"
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
