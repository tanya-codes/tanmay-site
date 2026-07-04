import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";

import ErrorBoundary from "@/components/portfolio/ErrorBoundary";
import CursorGlow from "@/components/portfolio/CursorGlow";
import IntroCurtain from "@/components/portfolio/IntroCurtain";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import CredentialMarquee from "@/components/portfolio/CredentialMarquee";
import About from "@/components/portfolio/About";
import Services from "@/components/portfolio/Services";
import Work from "@/components/portfolio/Work";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import BottomNav from "@/components/portfolio/BottomNav";
import AdminPanel from "@/components/portfolio/AdminPanel";
import { trackEvent } from "@/lib/track";

function Portfolio() {
  React.useEffect(() => {
    trackEvent("page_view", { path: "/" });
  }, []);

  return (
    <div className="relative">
      <ErrorBoundary>
        <IntroCurtain />
      </ErrorBoundary>
      <ErrorBoundary>
        <CursorGlow />
      </ErrorBoundary>
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      <main>
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <CredentialMarquee />
        </ErrorBoundary>
        <ErrorBoundary>
          <About />
        </ErrorBoundary>
        <ErrorBoundary>
          <Work />
        </ErrorBoundary>
        <ErrorBoundary>
          <Services />
        </ErrorBoundary>
        <ErrorBoundary>
          <Contact />
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <ErrorBoundary>
        <BottomNav />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
