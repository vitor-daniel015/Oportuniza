import { Check, ImagePlus, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

export function AvatarCropInput({
  children,
  className,
  disabled,
  onCroppedFile,
}: {
  children: ReactNode;
  className: string;
  disabled?: boolean;
  onCroppedFile: (file: File) => void | Promise<void>;
}) {
  const [sourceFile, setSourceFile] = useState<File | null>(null);

  return (
    <>
      <label className={className}>
        {children}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            setSourceFile(event.target.files?.[0] ?? null);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {sourceFile && (
        <AvatarCropModal
          file={sourceFile}
          onCancel={() => setSourceFile(null)}
          onConfirm={async (croppedFile) => {
            await onCroppedFile(croppedFile);
            setSourceFile(null);
          }}
        />
      )}
    </>
  );
}

function AvatarCropModal({
  file,
  onCancel,
  onConfirm,
}: {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function confirmCrop() {
    if (!croppedArea) return;
    setProcessing(true);
    setError("");
    try {
      const croppedFile = await createCroppedAvatar(imageUrl, croppedArea);
      await onConfirm(croppedFile);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível recortar a foto.");
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-[#101522]/80 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7">
          <div>
            <h2 id="crop-title" className="text-xl font-extrabold text-text-title sm:text-2xl">
              Ajuste sua foto
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Arraste a imagem e use o controle para aproximar ou afastar.
            </p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Cancelar recorte" className="shrink-0 rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <X size={24} />
          </button>
        </header>

        <div className="relative h-[46dvh] min-h-64 w-full bg-[#172536] sm:h-105">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              minZoom={1}
              maxZoom={3}
              aspect={1}
              cropShape="round"
              showGrid={false}
              objectFit="cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedArea(pixels)}
            />
          )}
        </div>

        <div className="px-5 py-5 sm:px-7">
          <label className="flex items-center gap-3">
            <ZoomOut className="shrink-0 text-blue-depth" size={21} aria-hidden="true" />
            <span className="sr-only">Aproximação da foto</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-blue-depth"
              aria-label="Aproximação da foto"
            />
            <ZoomIn className="shrink-0 text-blue-depth" size={21} aria-hidden="true" />
          </label>

          <p className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-depth">
            <ImagePlus size={18} className="shrink-0" />
            Tudo que estiver dentro do círculo aparecerá na sua foto de perfil.
          </p>
          {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={onCancel} disabled={processing} className="rounded-xl border border-gray-300 px-5 py-3 font-bold text-blue-depth disabled:opacity-50">
              Escolher outra foto
            </button>
            <button type="button" onClick={() => void confirmCrop()} disabled={processing || !croppedArea} className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-depth to-green-sprout px-5 py-3 font-bold text-white disabled:opacity-50">
              <Check size={20} /> {processing ? "Salvando..." : "Usar esta foto"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

async function createCroppedAvatar(imageUrl: string, area: Area) {
  const image = await loadBrowserImage(imageUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu preparar a foto.");

  const outputSize = 800;
  canvas.width = outputSize;
  canvas.height = outputSize;
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );
  if (!blob) throw new Error("Não foi possível gerar a foto recortada.");
  return new File([blob], "foto-perfil-recortada.jpg", { type: "image/jpeg" });
}

function loadBrowserImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível abrir essa imagem."));
    image.src = url;
  });
}
