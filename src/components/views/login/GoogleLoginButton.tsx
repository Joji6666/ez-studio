import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleLoginButton = () => {
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          "33257021890-oi8anu7gobv0qg1g1r7ohud3b98p3ru1.apps.googleusercontent.com"
        }
      >
        <GoogleLogin
          onSuccess={(res) => {
            console.log(res);
          }}
        />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleLoginButton;
