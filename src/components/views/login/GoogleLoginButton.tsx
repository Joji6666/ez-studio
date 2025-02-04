import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import useAuth from "./store/useAuth";
import { useNavigate } from "react-router-dom";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL;

const GoogleLoginButton = () => {
  const { setLoginInfo } = useAuth();
  const nav = useNavigate();

  const handleGoogleLogin = async (credential: string) => {
    const res = await axios.post(`${API_URL}/auth/login/google`, credential);

    if (res) {
      localStorage.setItem("token", res.data.token);
      setLoginInfo(res.data.userId);
      nav("/studio");
    }
  };
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
