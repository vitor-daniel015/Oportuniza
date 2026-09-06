import { Perfil } from "../components/PerfilPage/Perfil"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export function PerfilPage() {
    const navigate = useNavigate();

    return(
        <div className="min-h-screen bg-background">
            <Navbar onAuthClick={() => navigate("/entrar")} />
            <Perfil />
            <Footer />
        </div>
    )
}
