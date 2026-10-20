import {
  ArrowRight,
  CircleHelp,
  Bell,
  ChevronDown,
  Settings,
  Trash2,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  UserRound,
  X,
  Eye,
  BarChart3,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonOportuniza } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../service/LoginService";
import { deleteMyAccount } from "../service/MeuPerfilService";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../service/supabaseClient";

const links = [
  {
    label: "Página inicial",
    shortLabel: "Início",
    description: "Voltar para o começo",
    href: "/",
    icon: Home,
  },
  {
    label: "Como funciona",
    shortLabel: "Como funciona",
    description: "Entenda como usar o Oportuniza",
    href: "/#servicos",
    icon: CircleHelp,
  },
  {
    label: "Encontrar profissionais",
    shortLabel: "Profissionais",
    description: "Veja quem pode realizar seu serviço",
    href: "/prestadores",
    icon: Search,
  },
  {
    label: "Fale conosco",
    shortLabel: "Contato",
    description: "Peça ajuda ou envie uma mensagem",
    href: "/contato",
    icon: MessageCircle,
  },
];

type NavbarProps = {
  onAuthClick?: () => void;
};

export function Navbar({ onAuthClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileAccountExpanded, setIsMobileAccountExpanded] =
    useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accountRole, setAccountRole] = useState<string | null>(null);
  const [canViewPublicProfile, setCanViewPublicProfile] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();
  const isGuest = !authLoading && !user;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node))
        setIsAccountOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      setAccountRole(null);
      setCanViewPublicProfile(false);
      return;
    }
    async function loadAccountProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url, role, cadastro_completo")
        .eq("id", user!.id)
        .single();
      setAvatarUrl(data?.avatar_url ?? user!.user_metadata?.avatar_url ?? null);
      setAccountRole(data?.role ?? null);
      setCanViewPublicProfile(
        data?.role === "prestador" && data.cadastro_completo === true,
      );
    }
    void loadAccountProfile();
    window.addEventListener("oportuniza:avatar-updated", loadAccountProfile);
    return () =>
      window.removeEventListener(
        "oportuniza:avatar-updated",
        loadAccountProfile,
      );
  }, [user]);

  async function logout() {
    await signOut();
    closeMenu();
    navigate("/", { replace: true });
  }

  async function deleteAccount() {
    if (!user) return;
    const confirmation = window.prompt(
      "Esta ação apaga definitivamente sua conta e seus dados. Digite EXCLUIR para confirmar.",
    );
    if (confirmation !== "EXCLUIR") return;
    try {
      await deleteMyAccount(user.id);
      await signOut();
      closeMenu();
      navigate("/", { replace: true });
    } catch {
      notify("Não foi possível excluir a conta. Tente novamente.", "error");
    }
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setIsMobileAccountExpanded(false);
  }

  function openProfileSettings() {
    setIsAccountOpen(false);
    closeMenu();
    window.setTimeout(
      () => window.dispatchEvent(new Event("oportuniza:open-profile-settings")),
      0,
    );
  }

  const navigationLinks =
    accountRole === "prestador"
      ? [
          links[0],
          {
            label: "Métricas",
            shortLabel: "Métricas",
            description: "Acompanhe o interesse pelo seu trabalho",
            href: "/metricas",
            icon: BarChart3,
          },
          links[3],
        ]
      : user && accountRole === null
        ? [links[0], links[3]]
        : user
          ? links
          : links.filter((link) => link.href !== "/prestadores");

  return (
    <>
      <header
        className={`relative z-40 bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-5 sm:px-8 md:h-40 md:rounded-bl-[110px] md:px-10 md:pt-7 lg:px-[7%] ${isGuest ? "h-55" : "h-38"}`}
      >
        <div
          className={`flex items-center justify-between md:block md:h-auto ${isGuest ? "h-34" : "h-full"}`}
        >
          <img
            src="/assets/oportuniza-completo-branco.webp"
            alt="Oportuniza"
            className="h-auto w-44 object-contain sm:w-58 md:h-24 md:w-auto"
          />

          <div className="flex items-center gap-2 md:hidden">
            {isGuest && (
              <Link
                to="/entrar"
                className="rounded-lg px-3 py-2 text-sm font-bold text-white underline decoration-white/50 underline-offset-4"
              >
                Entrar
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menu da conta e navegação"
                aria-expanded={isMenuOpen}
                className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white/90 bg-blue-depth text-white shadow-md"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Sua foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={24} />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="rounded-md p-2 text-white"
              aria-label="Abrir menu com todas as opções"
              aria-expanded={isMenuOpen}
            >
              <Menu size={38} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {isGuest && (
          <Link
            to="/cadastrar"
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl bg-white px-5 py-4 text-blue-depth shadow-xl transition active:scale-[0.98] sm:left-8 sm:right-8 md:hidden"
          >
            <span>
              <strong className="block text-base">
                Faça parte do Oportuniza
              </strong>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-depth text-white">
              <ArrowRight size={22} />
            </span>
          </Link>
        )}

        <nav className="absolute left-1/2 top-29 hidden w-[min(86%,69.25rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-between rounded-[5px] bg-[#F7F9FA] px-5 py-4 shadow-[0_4px_4px_rgba(0,0,0,.25)] md:flex">
          <div className="flex flex-1 items-center justify-around">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-bold text-text-secondary transition-colors hover:text-text-title"
              >
                {link.shortLabel}
              </a>
            ))}
          </div>

          {user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
                aria-label="Abrir opções da conta"
                className="flex items-center gap-1 rounded-full bg-blue-depth p-1.5 pr-2 text-white shadow-md transition hover:bg-green-sprout"
              >
                <span className="grid h-9 w-9 overflow-hidden rounded-full bg-white/15">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Sua foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="m-auto" size={22} />
                  )}
                </span>
                <ChevronDown size={15} />
              </button>
              {isAccountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
                >
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
                    Sua conta
                  </p>
                  <AccountLink
                    to="/meu-perfil"
                    icon={<UserRound size={19} />}
                    title="Meu perfil"
                    description="Veja e edite seu perfil"
                    onClick={() => setIsAccountOpen(false)}
                  />
                  <AccountLink
                    to="/meu-perfil#configuracoes"
                    icon={<Settings size={19} />}
                    title="Configurações"
                    description="Dados, privacidade e perfil"
                    onClick={openProfileSettings}
                  />
                  {canViewPublicProfile && (
                    <AccountLink
                      to={`/prestador/${user.id}`}
                      icon={<Eye size={19} />}
                      title="Meu perfil público"
                      description="Veja seu perfil de prestador"
                      onClick={() => setIsAccountOpen(false)}
                    />
                  )}
                  <AccountLink
                    to="/notificacoes"
                    icon={<Bell size={19} />}
                    title="Notificações"
                    description="Veja alterações e novidades"
                    onClick={() => setIsAccountOpen(false)}
                  />
                  <hr className="my-1 border-gray-100" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-text-title hover:bg-gray-50"
                  >
                    <LogOut size={19} /> Sair da conta
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={deleteAccount}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={19} /> Excluir conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ButtonOportuniza
              title="Entrar ou criar conta"
              link="/entrar"
              color="#1e4f7a"
              colorHover="#163e61"
            />
          )}
        </nav>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#101522]/65 md:hidden"
          onClick={closeMenu}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="ml-auto flex h-full w-[82%] max-w-90 flex-col overflow-y-auto bg-linear-to-b from-blue-depth via-[#27737C] to-green-sprout px-6 py-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <img
                src="/assets/oportuniza-completo-branco.webp"
                alt="Oportuniza"
                className="w-42"
              />
              <button
                type="button"
                onClick={closeMenu}
                className="rounded-md p-2 text-white"
                aria-label="Fechar menu"
              >
                <X size={30} />
              </button>
            </div>

            <div
              className={
                user
                  ? "mt-5 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20"
                  : ""
              }
            >
            {user && (
              <button
                type="button"
                onClick={() =>
                  setIsMobileAccountExpanded((expanded) => !expanded)
                }
                aria-expanded={isMobileAccountExpanded}
                aria-controls="mobile-account-options"
                className="flex w-full items-center gap-3 border-b border-white/15 p-3 text-left text-white transition active:bg-white/20"
              >
                <span className="grid h-13 w-13 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-blue-depth">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Sua foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="m-auto" size={25} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block">Sua conta</strong>
                  <span className="block truncate text-xs text-white/80">
                    {user.email}
                  </span>
                </span>
                <ChevronDown
                  className={`shrink-0 transition-transform duration-200 ${
                    isMobileAccountExpanded ? "rotate-180" : ""
                  }`}
                  size={21}
                  aria-hidden="true"
                />
              </button>
            )}

            {user && isMobileAccountExpanded && (
              <div
                id="mobile-account-options"
                className="border-t border-white/25 px-2 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
              >
                <Link
                  to="/meu-perfil"
                  onClick={closeMenu}
                  className="flex items-start gap-3 rounded-xl px-3 py-3 text-white transition active:bg-white/20"
                >
                  <UserRound className="mt-0.5 shrink-0" size={21} />
                  <span>
                    <strong className="block text-sm">Meu perfil</strong>
                    <span className="block text-xs font-normal text-white/80">
                      Veja e edite seu perfil
                    </span>
                  </span>
                </Link>
                <Link
                  to="/meu-perfil#configuracoes"
                  onClick={openProfileSettings}
                  className="flex items-start gap-3 rounded-xl px-3 py-3 text-white transition active:bg-white/20"
                >
                  <Settings className="mt-0.5 shrink-0" size={21} />
                  <span>
                    <strong className="block text-sm">Configurações</strong>
                    <span className="block text-xs font-normal text-white/80">
                      Dados, privacidade e perfil
                    </span>
                  </span>
                </Link>
                {canViewPublicProfile && (
                  <Link
                    to={`/prestador/${user.id}`}
                    onClick={closeMenu}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 text-white transition active:bg-white/20"
                  >
                    <Eye className="mt-0.5 shrink-0" size={21} />
                    <span>
                      <strong className="block text-sm">
                        Meu perfil público
                      </strong>
                      <span className="block text-xs font-normal text-white/80">
                        Veja seu perfil de prestador
                      </span>
                    </span>
                  </Link>
                )}
                <Link
                  to="/notificacoes"
                  onClick={closeMenu}
                  className="flex items-start gap-3 rounded-xl px-3 py-3 text-white transition active:bg-white/20"
                >
                  <Bell className="mt-0.5 shrink-0" size={21} />
                  <span>
                    <strong className="block text-sm">Notificações</strong>
                    <span className="block text-xs font-normal text-white/80">
                      Veja alterações e novidades
                    </span>
                  </span>
                </Link>

                <div className="mt-2 space-y-2 border-t border-white/25 pt-3">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-bold text-white transition active:bg-white/20"
                  >
                    <LogOut size={21} /> Sair da conta
                  </button>
                  <button
                    type="button"
                    onClick={deleteAccount}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-red-200/70 bg-red-600 px-3 py-3 text-left font-bold text-white shadow-md transition active:bg-red-700"
                  >
                    <Trash2 size={21} /> Excluir conta
                  </button>
                </div>
              </div>
            )}
            </div>

            <nav className="mt-5 shrink-0 space-y-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                      <Icon size={21} />
                    </span>
                    <span>
                      <strong className="block">{link.label}</strong>
                      <span className="block text-xs font-normal text-white/80">
                        {link.description}
                      </span>
                    </span>
                  </a>
                );
              })}
            </nav>

            {!user && (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onAuthClick?.();
                }}
                className="mt-auto rounded-xl bg-white px-6 py-4 font-bold text-text-title shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={19} /> Entrar ou criar conta
                </span>
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function AccountLink({
  to,
  icon,
  title,
  description,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Link
      role="menuitem"
      to={to}
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl px-3 py-3 text-text-title hover:bg-blue-50"
    >
      {icon}
      <span>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs text-text-secondary">{description}</span>
      </span>
    </Link>
  );
}
