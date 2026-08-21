import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Contact } from "../components/ContactPage/Contact";

export function ContactPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen color-background">
            <Navbar onAuthClick={() => navigate("/auth")} />
            <main>
            <Contact />
            </main>
            <Footer />
        </div>
    );
}
export default ContactPage;
