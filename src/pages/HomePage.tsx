import { useNavigate } from "react-router-dom";
import { Features } from "../components/HomePage/Features";
import { HowItWorks } from "../components/HomePage/HowItWorks";
import { Footer } from "../components/Footer";
import { Hero } from "../components/HomePage/Hero";
import { Navbar } from "../components/Navbar";
import { CompleteDetails } from "../components/CompleteDetails";

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CompleteDetails/>
      </main>
      <Footer />
    </div>
  );
}
export default HomePage;
