import logo from './logo.svg';
import './App.css';
import MainLayout from "./components/layout/layout";
import {HomePage} from "./components/homePage/homePage";
import {MainLayoutTest} from "./components/layout/layoutTest";
import {GoogleOAuthProvider} from "@react-oauth/google";
// import {useLocation} from "react-router-dom";

export default function App() {
  // let location = useLocation();

  return (
      // <GoogleOAuthProvider clientId="2270790339-n2niqsp2h15felguam5h3nnrpbsvqiin.apps.googleusercontent.com">
      <MainLayout></MainLayout>
      // </GoogleOAuthProvider>
  );
}

// export default App;
