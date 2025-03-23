import Footer from "@/components/Footer/Index";
import Header from "@/components/Header";
import "@/styles/css/nunito.css";
import "@/styles/css/satoshi.css";
import "@/styles/css/style.css";
import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from "./provider";

export const metadata: Metadata = {
  title: "Bank Accounts Management System",
  description: "Bank Accounts Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='bg-bgColor font-nunito'
      >
        <ReduxProvider>
          
        
        <Header />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" 
        />
        <div className="min-h-screen  p-3">
          {children}
        </div>
        <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
