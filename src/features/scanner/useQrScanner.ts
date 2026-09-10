import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export type ScannerStatus = "idle" | "starting" | "scanning" | "found" | "error";

const REGION_ID = "fotour-qr-region";

export function useQrScanner() {
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stop = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      /* noop */
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setResult(null);
    setStatus("starting");
    try {
      await stop();
      const scanner = new Html5Qrcode(REGION_ID, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: { exact: "environment" } as unknown as string },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          setResult(decodedText);
          setStatus("found");
          void stop();
        },
        undefined,
      ).catch(async () => {
        // fallback quando o dispositivo não tem câmera traseira "exact"
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (decodedText) => {
            setResult(decodedText);
            setStatus("found");
            void stop();
          },
          undefined,
        );
      });
      setStatus((prev) => (prev === "found" ? prev : "scanning"));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível acessar a câmera.";
      setError(message);
      setStatus("error");
    }
  }, [stop]);

  const reset = useCallback(async () => {
    await stop();
    setResult(null);
    setError(null);
    setStatus("idle");
  }, [stop]);

  useEffect(() => () => void stop(), [stop]);

  return { regionId: REGION_ID, status, result, error, start, stop, reset };
}

export function asUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
