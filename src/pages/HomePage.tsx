import { useNavigate } from "react-router-dom";
import { Features } from "../components/HomePage/Features";
import { HowItWorks } from "../components/HomePage/HowItWorks";
import { Footer } from "../components/Footer";
import { Hero } from "../components/HomePage/Hero";
import { Navbar } from "../components/Navbar";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar onAuthClick={() => navigate("/auth")} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
export default Home;
