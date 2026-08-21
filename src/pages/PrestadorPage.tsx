import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Prestador } from "../components/PrestadorPage/Prestador";
import { MenuPrestador } from "../components/PrestadorPage/MenuPrestador";

export function PrestadorPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen color-background">
            <Navbar onAuthClick={() => navigate("/auth")} />
            <main>
            <MenuPrestador />
            </main>
            <Footer />
        </div>
    );
}
export default PrestadorPage;
