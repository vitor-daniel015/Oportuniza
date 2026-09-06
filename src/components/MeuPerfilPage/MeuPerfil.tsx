import { Camera, Eye, LogOut, MessageCircle, Pencil, Plus, Save, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCategories, type Category } from "../../service/CategoriesService";
import { signOut } from "../../service/LoginService";
import { addPortfolio, getMeuConteudo, getMeuPerfil, removePortfolio, saveMeuPerfil, saveReviewReply, uploadAvatar, type MeuPerfil as PerfilData, type MeuPortfolio, type MinhaAvaliacao, type SaveProfileInput } from "../../service/MeuPerfilService";
import { InputField } from "../InputField";
import { Stars } from "../PrestadorPage/Stars";

const emptyForm: SaveProfileInput = { nome: "", cpf: "", whatsapp: "", cidade: "", bairro: "", estado: "", avatarUrl: "", bio: "", categoriaId: "" };

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

  async function loadData(id: string) {
    const [profileData, categoryData, content] = await Promise.all([getMeuPerfil(id), getCategories(), getMeuConteudo(id)]);
    const p = profileData.perfil;
    setPerfil(p); setCategories(categoryData); setPortfolio(content.portfolio); setReviews(content.reviews);
    setForm({ nome: p.nome ?? "", cpf: p.cpf ?? "", whatsapp: p.whatsapp ?? "", cidade: p.cidade ?? "", bairro: p.bairro ?? "", estado: p.estado ?? "", avatarUrl: p.avatar_url ?? "", bio: p.bio ?? "", categoriaId: profileData.categoriaId });
  }

  useEffect(() => {
    if (!user) return;
    loadData(user.id).catch(() => setError("Não foi possível carregar seu perfil.")).finally(() => setLoading(false));
  }, [user]);

  const rating = useMemo(() => reviews.length ? reviews.reduce((sum, item) => sum + item.nota, 0) / reviews.length : 0, [reviews]);
  if (!authLoading && !user) return <Navigate to="/entrar" replace />;

  async function persist(nextForm = form) {
    setSaving(true); setError(""); setMessage("");
    const result = await saveMeuPerfil(nextForm);
    if (result.error) { setSaving(false); setError(result.error.message); return false; }
    if (user) await loadData(user.id);
    setSaving(false); setMessage(result.data ? "Perfil atualizado e publicado." : "Dados salvos. Complete os dados profissionais para publicar seu perfil.");
    return true;
  }

  async function submitProfile(event: FormEvent) { event.preventDefault(); if (await persist()) setEditOpen(false); }
  async function changeAvatar(file?: File) {
    if (!file || !user) return;
    try { setSaving(true); const avatarUrl = await uploadAvatar(user.id, file); const next = { ...form, avatarUrl }; setForm(next); await persist(next); }
    catch (cause) { setSaving(false); setError(cause instanceof Error ? cause.message : "Não foi possível enviar a foto."); }
  }
  async function submitPortfolio(event: FormEvent) {
    event.preventDefault();
    if (!user || !portfolioFile) return setError("Selecione uma imagem.");
    try { setSaving(true); setError(""); await addPortfolio(user.id, portfolioTitle, portfolioDescription, portfolioFile); await loadData(user.id); setPortfolioOpen(false); setPortfolioTitle(""); setPortfolioDescription(""); setPortfolioFile(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível adicionar o trabalho."); }
    finally { setSaving(false); }
  }
  async function deletePortfolio(id: string) { if (!user || !window.confirm("Deseja remover este trabalho?")) return; try { await removePortfolio(id); await loadData(user.id); } catch { setError("Não foi possível remover o trabalho."); } }
  async function submitReply(reviewId: string) { if (!user || !reply.trim()) return; try { setSaving(true); await saveReviewReply(reviewId, user.id, reply); await loadData(user.id); setReplyingTo(null); setReply(""); } catch { setError("Não foi possível salvar sua resposta."); } finally { setSaving(false); } }
  async function logout() { await signOut(); navigate("/", { replace: true }); }

  if (authLoading || loading) return <main className="grid min-h-[60vh] place-items-center text-text-secondary">Carregando seu perfil...</main>;
  if (!perfil) return <main className="grid min-h-[60vh] place-items-center text-red-600">{error || "Perfil não encontrado."}</main>;

  const isProvider = perfil.role === "prestador";
  const specialty = categories.find((item) => item.id.toString() === form.categoriaId)?.nome;
  const address = [form.bairro, form.cidade, form.estado].filter(Boolean).join(", ");

  return <main className="pb-12">
    <section className="relative mt-12 bg-linear-to-r from-blue-depth via-[#27737c] to-green-sprout text-white md:mt-14">
      <div className="mx-auto flex min-h-56 max-w-7xl items-end px-6 pb-8 pt-24 md:min-h-64 md:items-center md:pb-0 md:pl-80 md:pt-0 lg:pl-96"><div><h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">{form.nome}</h1><p className="mt-1 text-xl sm:text-3xl">{specialty || (isProvider ? "Prestador" : "Contratante")}</p></div></div>
      <div className="absolute left-6 top-0 grid h-36 w-36 -translate-y-8 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:left-[7%] md:top-1/2 md:h-60 md:w-60 md:-translate-y-1/2">{form.avatarUrl ? <img src={form.avatarUrl} alt={form.nome} className="h-full w-full object-cover" /> : <UserRound className="text-blue-depth/40" size={90} />}</div>
    </section>

    <div className="mx-auto max-w-7xl px-6 pt-12 sm:px-10 md:pt-16">
      <div className="flex flex-wrap justify-between gap-4"><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"><Camera size={18} /> Alterar foto<input type="file" accept="image/*" className="hidden" onChange={(e) => changeAvatar(e.target.files?.[0])} /></label><div className="flex flex-wrap gap-3">{isProvider && perfil.cadastro_completo && <Link to={`/prestador/${perfil.id}`} className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"><Eye size={18} /> Ver perfil público</Link>}<button onClick={logout} className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 font-bold text-white"><LogOut size={18} /> Sair</button></div></div>
      {(error || message) && <p className={`mt-6 rounded-xl px-4 py-3 ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</p>}

      <section className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-7"><div><h2 className="text-3xl font-extrabold text-text-title">Avaliação</h2><div className="mt-2 flex w-fit items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-md"><Stars value={rating} size={25} color="#141414" borderColor="#141414" /><strong>{reviews.length} avaliações</strong></div></div><div><div className="flex items-center justify-between"><h2 className="text-3xl font-extrabold text-text-title">Endereço</h2><EditButton onClick={() => setEditOpen(true)} /></div><p className="mt-2 rounded-full border bg-white px-5 py-3 font-semibold shadow-md">{address || "Endereço não informado"}</p></div></div>
        <div><div className="flex items-center justify-between"><h2 className="text-3xl font-extrabold text-text-title">Sobre mim</h2><EditButton onClick={() => setEditOpen(true)} /></div><p className="mt-2 min-h-36 rounded-3xl border bg-white p-5 leading-relaxed shadow-md">{form.bio || "Adicione uma descrição sobre sua experiência e seus serviços."}</p></div>
      </section>

      {form.whatsapp && <a href={`https://wa.me/${form.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="mt-9 flex w-full items-center justify-center gap-3 rounded-lg bg-green-sprout px-6 py-4 text-xl font-extrabold text-white md:text-3xl"><MessageCircle size={32} /> Enviar mensagem</a>}

      {isProvider && <section className="mt-12"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Portfólio de trabalhos</h2><button onClick={() => setPortfolioOpen(true)} className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"><Plus size={18} /> Adicionar</button></div>{portfolio.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{portfolio.map((item) => <figure key={item.id} className="group relative overflow-hidden rounded-xl bg-white shadow-sm"><img src={item.imagem_url} alt={item.titulo} className="h-80 w-full object-cover" /><figcaption className="p-4"><h3 className="font-bold text-text-title">{item.titulo}</h3>{item.descricao && <p className="mt-1 text-sm text-text-secondary">{item.descricao}</p>}</figcaption><button onClick={() => deletePortfolio(item.id)} aria-label={`Remover ${item.titulo}`} className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow-lg lg:opacity-0 lg:transition lg:group-hover:opacity-100"><Trash2 size={17} /></button></figure>)}</div> : <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">Adicione fotos dos seus trabalhos para apresentar seu serviço.</p>}</section>}

      {isProvider && <Reviews reviews={reviews} replyingTo={replyingTo} reply={reply} saving={saving} onStart={(review, current) => { setReplyingTo(review); setReply(current); }} onReply={setReply} onSubmit={submitReply} />}
    </div>

    {editOpen && <Modal title="Editar perfil" onClose={() => setEditOpen(false)}><ProfileForm form={form} setForm={setForm} categories={categories} isProvider={isProvider} saving={saving} onSubmit={submitProfile} /></Modal>}
    {portfolioOpen && <Modal title="Adicionar trabalho" onClose={() => setPortfolioOpen(false)}><form onSubmit={submitPortfolio} className="space-y-4"><InputField id="portfolio-title" type="text" label="Título" placeholder="Ex.: Reforma de cozinha" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} required /><InputField id="portfolio-image" type="file" label="Foto do trabalho" placeholder="" accept="image/*" onChange={(e) => setPortfolioFile(e.target.files?.[0] ?? null)} required /><label><span className="mb-1 ml-4 block text-xs text-gray-600">Descrição</span><textarea value={portfolioDescription} onChange={(e) => setPortfolioDescription(e.target.value)} rows={4} className="w-full rounded-3xl bg-[#dadada] px-5 py-4" /></label><button disabled={saving} className="w-full rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 font-bold text-white">{saving ? "Enviando..." : "Adicionar ao portfólio"}</button></form></Modal>}
    {isProvider && !perfil.onboarding_completo && <Onboarding form={form} setForm={setForm} saving={saving} error={error} onSubmit={submitProfile} />}
  </main>;
}

function EditButton({ onClick }: { onClick: () => void }) { return <button onClick={onClick} className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 font-bold text-blue-depth shadow-md"><Pencil size={17} /> Editar</button>; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) { return <div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-[#10253b]/65 px-5 py-8 backdrop-blur-sm"><div className="relative w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl sm:p-9"><button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100"><X size={22} /></button><h2 className="mb-7 pr-10 text-2xl font-extrabold text-text-title">{title}</h2>{children}</div></div>; }

type FormSetter = React.Dispatch<React.SetStateAction<SaveProfileInput>>;
function ProfileForm({ form, setForm, categories, isProvider, saving, onSubmit }: { form: SaveProfileInput; setForm: FormSetter; categories: Category[]; isProvider: boolean; saving: boolean; onSubmit: (e: FormEvent) => void }) { return <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2"><InputField id="edit-name" type="text" label="Nome" placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /><InputField id="edit-whatsapp" type="tel" label="WhatsApp" placeholder="(15) 99999-9999" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} required /><InputField id="edit-city" type="text" label="Cidade" placeholder="Sua cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} required /><InputField id="edit-neighborhood" type="text" label="Bairro" placeholder="Seu bairro" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} required /><InputField id="edit-state" type="text" label="Estado" placeholder="SP" maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} required />{isProvider && <label className="flex flex-col"><span className="mb-1 ml-4 text-xs text-gray-600">Categoria</span><select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} className="rounded-full bg-[#dadada] px-5 py-3" required><option value="">Selecione</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>}<label className="sm:col-span-2"><span className="mb-1 ml-4 block text-xs text-gray-600">Sobre mim</span><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} className="w-full rounded-3xl bg-[#dadada] px-5 py-4" required={isProvider} /></label><button disabled={saving} className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 font-bold text-white sm:col-span-2"><Save size={18} /> {saving ? "Salvando..." : "Salvar alterações"}</button></form>; }

function Onboarding({ form, setForm, saving, error, onSubmit }: { form: SaveProfileInput; setForm: FormSetter; saving: boolean; error: string; onSubmit: (e: FormEvent) => void }) { return <div className="fixed inset-0 z-70 grid place-items-center bg-[#10253b]/70 px-5 py-8 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl sm:p-10"><h2 className="text-2xl font-medium leading-tight text-blue-depth sm:text-3xl">Para terminar seu cadastro precisamos apenas de algumas informações</h2><h3 className="mt-4 text-xl font-extrabold text-green-sprout sm:text-2xl">Informações pessoais</h3><div className="mt-6 space-y-4"><InputField id="onboarding-cpf" type="text" label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required /><InputField id="onboarding-whatsapp" type="tel" label="WhatsApp" placeholder="(15) 99999-9999" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} required /><div className="grid gap-4 sm:grid-cols-2"><InputField id="onboarding-city" type="text" label="Cidade" placeholder="Sua cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} required /><InputField id="onboarding-neighborhood" type="text" label="Bairro" placeholder="Seu bairro" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} required /></div><InputField id="onboarding-state" type="text" label="Estado" placeholder="SP" value={form.estado} maxLength={2} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} required /></div>{error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button disabled={saving} className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 font-bold text-white"><Save size={19} /> {saving ? "Salvando..." : "Terminar cadastro"}</button></form></div>; }

function Reviews({ reviews, replyingTo, reply, saving, onStart, onReply, onSubmit }: { reviews: MinhaAvaliacao[]; replyingTo: string | null; reply: string; saving: boolean; onStart: (id: string, text: string) => void; onReply: (text: string) => void; onSubmit: (id: string) => void }) { return <section className="mt-12"><h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Depoimentos dos clientes</h2><div className="mt-7 space-y-5">{reviews.length ? reviews.map((review) => { const response = Array.isArray(review.review_replies) ? review.review_replies[0] : review.review_replies; return <article key={review.id} className="rounded-3xl border bg-white p-6 shadow-md"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-text-title">Cliente Oportuniza</p><Stars value={review.nota} size={18} /></div><button onClick={() => onStart(review.id, response?.resposta_texto ?? "")} className="flex items-center gap-2 rounded-full border px-5 py-2 font-bold text-green-sprout"><Pencil size={16} /> {response ? "Editar resposta" : "Responder"}</button></div><p className="mt-4">“{review.comentario || "Serviço avaliado sem comentário."}”</p>{response && <div className="mt-4 rounded-2xl bg-green-sprout/15 p-4"><strong>Sua resposta</strong><p>{response.resposta_texto}</p></div>}{replyingTo === review.id && <div className="mt-4"><textarea value={reply} onChange={(e) => onReply(e.target.value)} rows={3} className="w-full rounded-2xl bg-[#dadada] px-5 py-3" placeholder="Escreva sua resposta" /><button onClick={() => onSubmit(review.id)} disabled={saving} className="mt-2 rounded-lg bg-green-sprout px-5 py-2 font-bold text-white">Salvar resposta</button></div>}</article>; }) : <p className="rounded-2xl bg-white p-6 text-text-secondary shadow-sm">Você ainda não recebeu avaliações.</p>}</div></section>; }
