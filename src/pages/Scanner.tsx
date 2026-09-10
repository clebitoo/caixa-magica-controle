import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { asUrl, useQrScanner } from "@/features/scanner/useQrScanner";
import { buildThumbUrl } from "@/features/roverpix/api";
import { useRoverpixMedias } from "@/features/roverpix/useRoverpixMedias";
import { Camera, CheckCircle2, Loader2, RotateCcw, ScanLine } from "lucide-react";

const Scanner = () => {
  const { regionId, status, result, error, start, reset } = useQrScanner();
  const lookup = useRoverpixMedias();
  const url = asUrl(result);
  const live = status === "starting" || status === "scanning";

  useEffect(() => {
    if (result) void lookup.lookup(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const restart = () => {
    lookup.reset();
    void start();
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background px-5 pb-10 pt-12">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-glow blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8">
        <header className="text-center">
          <p className="text-4xl">🦖</p>
          <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.18em] text-primary">
            Fotour Experience
          </h1>
          <p className="mt-4 text-lg font-medium text-foreground">
            Escaneie o QR das suas fotos
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Permita o acesso à câmera e aponte para o QR Code.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-border bg-card p-4 shadow-elevated">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
            <div id={regionId} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />

            {!live && status !== "found" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <ScanLine className="h-10 w-10 opacity-60" />
                <span className="text-sm">Câmera desligada</span>
              </div>
            )}

            {status === "found" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary text-primary">
                <CheckCircle2 className="h-12 w-12" />
                <span className="font-display text-lg uppercase tracking-widest">
                  QR Code encontrado!
                </span>
              </div>
            )}

            {live && (
              <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-primary/70" />
            )}
          </div>

          {status === "starting" && (
            <p className="mt-4 text-center text-sm text-muted-foreground">Abrindo câmera…</p>
          )}
          {status === "scanning" && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Procurando QR Code…
            </p>
          )}
          {error && (
            <p className="mt-4 text-center text-sm text-destructive">{error}</p>
          )}
        </section>

        {lookup.status === "loading" && (
          <section className="flex w-full items-center justify-center gap-3 rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Consultando suas fotos…
          </section>
        )}

        {lookup.status === "found" && (
          <section className="w-full space-y-4 rounded-3xl border border-primary/30 bg-card p-5">
            <div className="text-center">
              <h2 className="font-display text-lg uppercase tracking-[0.15em] text-primary">
                Suas fotos foram encontradas! 📸
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Encontramos {lookup.medias.length}{" "}
                {lookup.medias.length === 1 ? "foto" : "fotos"}.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {lookup.medias.map((media) => (
                <img
                  key={String(media.id)}
                  src={buildThumbUrl(media)}
                  alt={media.filename}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {lookup.status === "empty" && (
          <section className="w-full rounded-3xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Nenhuma foto vendida foi encontrada para este QR Code.
          </section>
        )}

        {lookup.status === "invalid-qr" && (
          <section className="w-full rounded-3xl border border-destructive/40 bg-card p-5 text-center text-sm text-destructive">
            QR Code inválido para esta experiência.
          </section>
        )}

        {lookup.status === "error" && (
          <section className="w-full rounded-3xl border border-destructive/40 bg-card p-5 text-center text-sm text-destructive">
            {lookup.isCors
              ? "Erro de comunicação (CORS): o navegador bloqueou a consulta à Roverpix."
              : "Erro de comunicação com a Roverpix."}
          </section>
        )}

        <div className="w-full">
          {status === "found" ? (
            <Button size="lg" className="h-14 w-full text-base tracking-wide" onClick={restart}>
              <RotateCcw className="mr-2 h-5 w-5" />
              Escanear novamente
            </Button>
          ) : live ? (
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-full text-base tracking-wide"
              onClick={() => void reset()}
            >
              Fechar câmera
            </Button>
          ) : (
            <Button size="lg" className="h-14 w-full text-base tracking-wide" onClick={restart}>
              <Camera className="mr-2 h-5 w-5" />
              Abrir câmera
            </Button>
          )}
        </div>

        {(result || lookup.sessionId || lookup.errorMessage) && (
          <section className="w-full space-y-2 rounded-2xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
            <p className="font-display uppercase tracking-[0.2em] text-muted-foreground/80">
              Diagnóstico
            </p>
            <p className="break-all">
              <strong>QR lido:</strong> {url ?? result ?? "—"}
            </p>
            <p className="break-all">
              <strong>Identificador detectado:</strong> {lookup.sessionId ?? "—"}
            </p>
            <p>
              <strong>Quantidade de fotos:</strong>{" "}
              {lookup.status === "found" || lookup.status === "empty"
                ? lookup.medias.length
                : "—"}
            </p>
            {lookup.errorMessage && (
              <p className="break-all text-destructive">
                <strong>Erro:</strong> {lookup.errorMessage}
              </p>
            )}
          </section>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Nenhuma imagem ou dado é armazenado. Tudo acontece no seu navegador.
        </p>
      </div>
    </main>
  );
};

export default Scanner;
