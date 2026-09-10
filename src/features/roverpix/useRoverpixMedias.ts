import { useCallback, useState } from "react";
import {
  extractSessionId,
  fetchSoldMedias,
  RoverpixError,
  type RoverpixMedia,
} from "./api";

export type LookupStatus =
  | "idle"
  | "loading"
  | "found"
  | "empty"
  | "invalid-qr"
  | "error";

export function useRoverpixMedias() {
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [medias, setMedias] = useState<RoverpixMedia[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCors, setIsCors] = useState(false);

  const reset = useCallback(() => {
    setStatus("idle");
    setSessionId(null);
    setMedias([]);
    setErrorMessage(null);
    setIsCors(false);
  }, []);

  const lookup = useCallback(async (qrValue: string) => {
    setMedias([]);
    setErrorMessage(null);
    setIsCors(false);

    const id = extractSessionId(qrValue);
    setSessionId(id);

    if (!id) {
      setStatus("invalid-qr");
      setErrorMessage("O QR Code lido não contém uma URL de galeria válida.");
      return;
    }

    setStatus("loading");
    try {
      const list = await fetchSoldMedias(id);
      setMedias(list);
      setStatus(list.length > 0 ? "found" : "empty");
    } catch (err) {
      if (err instanceof RoverpixError) {
        setIsCors(err.kind === "cors");
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err instanceof Error ? err.message : "Falha desconhecida.");
      }
      setStatus("error");
    }
  }, []);

  return { status, sessionId, medias, errorMessage, isCors, lookup, reset };
}
