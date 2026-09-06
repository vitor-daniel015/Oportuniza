import { Camera, Eye, LogOut, MessageCircle, Pencil, Plus, Trash2, UserRound, } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCategories, type Category } from "../../service/CategoriesService";
import { signOut } from "../../service/LoginService";
import { applyPendingGoogleRole } from "../../service/LoginService";
import { addPortfolio, getMeuConteudo, getMeuPerfil, removePortfolio, saveMeuPerfil, saveReviewReply, uploadAvatar, type MeuPerfil as PerfilData, type MeuPortfolio, type MinhaAvaliacao, type SaveProfileInput, } from "../../service/MeuPerfilService";
import { Stars } from "../PrestadorPage/Stars";
import { OnboardingModal } from "./OnboardingModal";
import { AvatarCropInput } from "./AvatarCropInput";
import { PortfolioModal } from "./PortfolioModal";
import { ProfileForm } from "./ProfileForm";
import { ProfileModal } from "./ProfileModal";
import { ReviewsSection } from "./ReviewsSection";
import { PortfolioLightbox, type LightboxImage } from "../PortfolioLightbox";
import { BackButton } from "../BackButton";

const emptyForm: SaveProfileInput = {
  nome: "",
  cpf: "",
  whatsapp: "",
  cidade: "",
  bairro: "",
  estado: "",
  avatarUrl: "",
  bio: "",
  categoriaId: "",
};

export function MeuPerfil() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [portfolio, setPortfolio] = useState<MeuPortfolio[]>([]);
  const [reviews, setReviews] = useState<MinhaAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<LightboxImage | null>(null);

  async function loadData(id: string) {
    const [profileData, categoryData, content] = await Promise.all([
      getMeuPerfil(id),
      getCategories(),
      getMeuConteudo(id),
    ]);
    const p = profileData.perfil;
    setPerfil(p);
    setCategories(categoryData);
    setPortfolio(content.portfolio);
    setReviews(content.reviews);
    setForm({
      nome: p.nome ?? "",
      cpf: p.cpf ?? "",
      whatsapp: p.whatsapp ?? "",
      cidade: p.cidade ?? "",
      bairro: p.bairro ?? "",
      estado: p.estado ?? "",
      avatarUrl: p.avatar_url ?? "",
      bio: p.bio ?? "",
      categoriaId: profileData.categoriaId,
    });
  }

  useEffect(() => {
    if (!user) return;
    applyPendingGoogleRole()
      .then(() => loadData(user.id))
      .catch(() => setError("Não foi possível carregar seu perfil."))
      .finally(() => setLoading(false));
  }, [user]);

  const rating = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((sum, item) => sum + item.nota, 0) / reviews.length
        : 0,
    [reviews],
  );
  if (!authLoading && !user) return <Navigate to="/entrar" replace />;

  async function persist(nextForm = form) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await saveMeuPerfil(nextForm);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      if (user) await loadData(user.id);
      setMessage(
        result.data
          ? "Perfil atualizado e publicado."
          : "Dados salvos. Complete os dados profissionais para publicar seu perfil.",
      );
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível validar o conteúdo.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function submitProfile(event: FormEvent) {
    event.preventDefault();
    if (await persist()) setEditOpen(false);
  }
  async function uploadOnboardingAvatar(file: File) {
    if (!user) throw new Error("Entre novamente para enviar sua foto.");
    setError("");
    return uploadAvatar(user.id, file);
  }
  async function changeAvatar(file?: File) {
    if (!file || !user) return;
    try {
      setSaving(true);
      const avatarUrl = await uploadAvatar(user.id, file);
      const next = { ...form, avatarUrl };
      setForm(next);
      await persist(next);
    } catch (cause) {
      setSaving(false);
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível enviar a foto.",
      );
    }
  }
  async function submitPortfolio(event: FormEvent) {
    event.preventDefault();
    if (!user || !portfolioFile) return setError("Selecione uma imagem.");
    try {
      setSaving(true);
      setError("");
      await addPortfolio(
        user.id,
        portfolioTitle,
        portfolioDescription,
        portfolioFile,
      );
      await loadData(user.id);
      setPortfolioOpen(false);
      setPortfolioTitle("");
      setPortfolioDescription("");
      setPortfolioFile(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível adicionar o trabalho.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function deletePortfolio(id: string) {
    if (!user || !window.confirm("Deseja remover este trabalho?")) return;
    try {
      await removePortfolio(id);
      await loadData(user.id);
    } catch {
      setError("Não foi possível remover o trabalho.");
    }
  }
  async function submitReply(reviewId: string) {
    if (!user || !reply.trim()) return;
    try {
      setSaving(true);
      await saveReviewReply(reviewId, user.id, reply);
      await loadData(user.id);
      setReplyingTo(null);
      setReply("");
    } catch {
      setError("Não foi possível salvar sua resposta.");
    } finally {
      setSaving(false);
    }
  }
  async function logout() {
    await signOut();
    navigate("/", { replace: true });
  }

  if (authLoading || loading)
    return (
      <main className="grid min-h-[60vh] place-items-center text-text-secondary">
        Carregando seu perfil...
      </main>
    );
  if (!perfil)
    return (
      <main className="grid min-h-[60vh] place-items-center text-red-600">
        {error || "Perfil não encontrado."}
      </main>
    );

  const isProvider = perfil.role === "prestador";
  const specialty = categories.find(
    (item) => item.id.toString() === form.categoriaId,
  )?.nome;
  const address = [form.bairro, form.cidade, form.estado]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="pb-12">
      <section className="relative bg-linear-to-r from-blue-depth via-[#27737c] to-green-sprout text-white md:mt-14">
        <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 md:pt-14">
          <BackButton label="Voltar à página anterior" />
        </div>
        <div className="mx-auto min-h-24 max-w-7xl px-6 md:flex md:min-h-64 md:items-center md:pl-80 lg:pl-96">
          <div className="hidden md:block">
            <h1 className="text-5xl font-extrabold lg:text-6xl">{form.nome}</h1>
            <p className="mt-1 text-3xl">
              {specialty || (isProvider ? "Prestador" : "Contratante")}
            </p>
          </div>
        </div>
        <div className="absolute left-1/2 top-full lg:top-1/2 grid h-44 w-44 -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:left-[7%] md:h-60 md:w-60 md:translate-x-0">
          {form.avatarUrl ? (
            <img
              src={form.avatarUrl}
              alt={form.nome}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="text-blue-depth/40" size={90} />
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-3 pt-28 sm:px-6 md:px-10 md:pt-16">
        <div className="mb-6 text-center md:hidden">
          <h1 className="mx-auto max-w-sm text-3xl font-extrabold leading-tight text-text-title min-[380px]:text-4xl">
            {form.nome}
          </h1>
          <p className="mt-1 text-xl text-blue-depth min-[380px]:text-2xl">
            {specialty || (isProvider ? "Prestador" : "Contratante")}
          </p>
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <AvatarCropInput
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"
            disabled={saving}
            onCroppedFile={(file) => changeAvatar(file)}
          >
            <Camera size={18} /> Alterar foto
          </AvatarCropInput>
          <div className="flex flex-wrap gap-3">
            {isProvider && perfil.cadastro_completo && (
              <Link
                to={`/prestador/${perfil.id}`}
                className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"
              >
                <Eye size={18} /> Ver perfil público
              </Link>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 font-bold text-white"
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
        {(error || message) && (
          <p
            className={`mt-6 rounded-xl px-4 py-3 ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {error || message}
          </p>
        )}

        <section className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-7">
            <div>
              <h2 className="text-3xl font-extrabold text-text-title">
                Avaliação
              </h2>
              <div className="mt-2 flex w-fit items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-md">
                <Stars
                  value={rating}
                  size={25}
                  color="#1e4f7a"
                  borderColor="#1e4f7a"
                />
                <strong>{reviews.length} avaliações</strong>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-text-title">
                  Endereço
                </h2>
                <EditButton onClick={() => setEditOpen(true)} />
              </div>
              <p className="mt-2 rounded-full border bg-white px-5 py-3 font-semibold shadow-md">
                {address || "Endereço não informado"}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-extrabold text-text-title">
                Sobre mim
              </h2>
              <EditButton onClick={() => setEditOpen(true)} />
            </div>
            <p className="mt-2 min-h-36 rounded-3xl border bg-white p-5 leading-relaxed shadow-md">
              {form.bio ||
                "Adicione uma descrição sobre sua experiência e seus serviços."}
            </p>
          </div>
        </section>

        {form.whatsapp && (
          <a
            href={`https://wa.me/${form.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-lg bg-green-sprout px-6 py-4 text-xl font-extrabold text-white md:text-3xl"
          >
            <MessageCircle size={32} /> Enviar mensagem
          </a>
        )}

        {isProvider && (
          <section className="mt-12">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
                Portfólio de trabalhos
              </h2>
              <button
                onClick={() => setPortfolioOpen(true)}
                className="flex shrink-0 items-center gap-1 rounded-full border bg-white px-3 py-2 text-sm font-bold text-blue-depth shadow-md sm:gap-2 sm:px-5 sm:text-base"
              >
                <Plus size={18} /> Adicionar
              </button>
            </div>
            {portfolio.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {portfolio.map((item) => (
                  <figure
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedPortfolio(item)}
                      className="block w-full cursor-zoom-in overflow-hidden"
                      aria-label={`Ampliar foto: ${item.titulo}`}
                    >
                      <img
                        src={item.imagem_url}
                        alt={item.titulo}
                        className="h-52 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-80"
                      />
                    </button>
                    <figcaption className="p-3 sm:p-4">
                      <h3 className="text-sm font-bold text-text-title sm:text-base">
                        {item.titulo}
                      </h3>
                      {item.descricao && (
                        <p className="mt-1 hidden text-sm text-text-secondary sm:block">
                          {item.descricao}
                        </p>
                      )}
                    </figcaption>
                    <button
                      onClick={() => deletePortfolio(item.id)}
                      aria-label={`Remover ${item.titulo}`}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow-lg lg:opacity-0 lg:transition lg:group-hover:opacity-100"
                    >
                      <Trash2 size={17} />
                    </button>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">
                Adicione fotos dos seus trabalhos para apresentar seu serviço.
              </p>
            )}
          </section>
        )}

        {isProvider && (
          <ReviewsSection
            reviews={reviews}
            replyingTo={replyingTo}
            reply={reply}
            saving={saving}
            onStart={(review, current) => {
              setReplyingTo(review);
              setReply(current);
            }}
            onReply={setReply}
            onSubmit={submitReply}
          />
        )}
      </div>

      {editOpen && (
        <ProfileModal title="Editar perfil" onClose={() => setEditOpen(false)}>
          <ProfileForm
            form={form}
            setForm={setForm}
            categories={categories}
            isProvider={isProvider}
            saving={saving}
            onSubmit={submitProfile}
          />
        </ProfileModal>
      )}
      <PortfolioModal
        open={portfolioOpen}
        title={portfolioTitle}
        description={portfolioDescription}
        file={portfolioFile}
        saving={saving}
        onClose={() => setPortfolioOpen(false)}
        onTitleChange={setPortfolioTitle}
        onDescriptionChange={setPortfolioDescription}
        onFileChange={setPortfolioFile}
        onSubmit={submitPortfolio}
      />
      <PortfolioLightbox
        image={selectedPortfolio}
        onClose={() => setSelectedPortfolio(null)}
      />
      {isProvider && !perfil.onboarding_completo && (
        <OnboardingModal
          form={form}
          setForm={setForm}
          categories={categories}
          saving={saving}
          error={error}
          onUploadAvatar={uploadOnboardingAvatar}
          onSubmit={submitProfile}
        />
      )}
    </main>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"
    >
      <Pencil size={17} /> Editar
    </button>
  );
}
