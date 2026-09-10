import { ROVERPIX_API_BASE, ROVERPIX_ORGANIZATION_ID } from "./config";

export type RoverpixMedia = {
  id: string | number;
  filename: string;
  preview_path?: string | null;
  thumb_path?: string | null;
  original_path?: string | null;
  type?: string | null;
};

export type RoverpixErrorKind = "invalid-qr" | "cors" | "network" | "http" | "parse";

export class RoverpixError extends Error {
  kind: RoverpixErrorKind;
  constructor(kind: RoverpixErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

/** Extrai o identificador da sessão a partir do caminho da URL lida no QR. */
export function extractSessionId(rawValue: string): string | null {
  const value = rawValue.trim();
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const galleryIndex = segments.lastIndexOf("gallery");
  const candidate =
    galleryIndex >= 0 && segments[galleryIndex + 1]
      ? segments[galleryIndex + 1]
      : segments[segments.length - 1];

  return candidate ? decodeURIComponent(candidate) : null;
}

export function buildMediasUrl(sessionId: string): string {
  return `${ROVERPIX_API_BASE}/medias/${ROVERPIX_ORGANIZATION_ID}/${encodeURIComponent(
    sessionId,
  )}?secret=undefined`;
}

export function buildThumbUrl(media: RoverpixMedia): string {
  return `${ROVERPIX_API_BASE}/photo/download/${media.id}/${encodeURIComponent(
    media.filename,
  )}?size=thumb&cache=null`;
}

export async function fetchSoldMedias(sessionId: string): Promise<RoverpixMedia[]> {
  const url = buildMediasUrl(sessionId);
  let response: Response;
  try {
    response = await fetch(url, { method: "GET", mode: "cors" });
  } catch (err) {
    throw new RoverpixError(
      "cors",
      `Requisição bloqueada pelo navegador (provável CORS) ao chamar ${url}. Detalhe: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  if (!response.ok) {
    throw new RoverpixError("http", `Resposta HTTP ${response.status} da Roverpix.`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new RoverpixError("parse", "Não foi possível interpretar a resposta da Roverpix.");
  }

  const container = (json ?? {}) as Record<string, unknown>;
  const nested = (container.data ?? {}) as Record<string, unknown>;
  const list = (container.sold_medias ?? nested.sold_medias) as unknown;

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => item as Record<string, unknown>)
    .filter((item) => item && item.id != null && typeof item.filename === "string")
    .map((item) => ({
      id: item.id as string | number,
      filename: item.filename as string,
      preview_path: (item.preview_path as string) ?? null,
      thumb_path: (item.thumb_path as string) ?? null,
      original_path: (item.original_path as string) ?? null,
      type: (item.type as string) ?? null,
    }));
}
