import Footer from "../components/ui/Footer";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {


  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
     <Navbar/>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <Outlet/>
      </main>

      {/* FOOTER */}
      <Footer/>

      <ChatBot />
    </div>
  );
}

