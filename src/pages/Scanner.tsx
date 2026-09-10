import { Button } from "@/components/ui/button";
import { asUrl, useQrScanner } from "@/features/scanner/useQrScanner";
import { Camera, CheckCircle2, Link2, RotateCcw, ScanLine } from "lucide-react";

const Scanner = () => {
  const { regionId, status, result, error, start, reset } = useQrScanner();
  const url = asUrl(result);
  const live = status === "starting" || status === "scanning";

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

        {result && (
          <section className="w-full space-y-3 rounded-3xl border border-primary/30 bg-card p-5">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              Conteúdo lido
            </h2>
            <p className="break-all rounded-xl bg-secondary p-3 text-sm text-foreground">
              {result}
            </p>
            {url && (
              <p className="flex items-start gap-2 break-all text-sm text-muted-foreground">
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{url}</span>
              </p>
            )}
          </section>
        )}

        <div className="w-full">
          {status === "found" ? (
            <Button size="lg" className="h-14 w-full text-base tracking-wide" onClick={() => void start()}>
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
            <Button size="lg" className="h-14 w-full text-base tracking-wide" onClick={() => void start()}>
              <Camera className="mr-2 h-5 w-5" />
              Abrir câmera
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Nenhuma imagem ou dado é armazenado. Tudo acontece no seu navegador.
        </p>
      </div>
    </main>
  );
};

export default Scanner;
