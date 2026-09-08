import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./app/store";
import { ContextProvider } from "./app/context/ContextProvider";
import App from "./app/App";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "605051670982-fktujlcf1962j0b5v25o2r6cbb7t351o.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <ContextProvider>
          <App />
        </ContextProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
