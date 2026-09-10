# Consulta das fotos pelo parâmetro `card`

O leitor de QR continua exatamente como está. Muda apenas o que acontece depois da leitura.

## Sobre o erro relatado

O arquivo `src/lib/utils.ts` tem só 6 linhas e a verificação de tipos passa sem erros. O erro citado é antigo (de uma versão anterior do arquivo) e não precisa de correção.

## O que muda

1. Ao ler o QR, pegar o valor do parâmetro `card` da URL (o código é sempre dinâmico, nunca fixo no app).
2. Consultar a Roverpix com esse código e usar apenas as fotos vendidas (`sold_medias`).
3. Mostrar "FOTOS ENCONTRADAS! 📸" e "Encontramos X fotos da sua compra." seguido da grade de miniaturas.
4. Manter o diagnóstico atual: URL lida, identificador detectado e quantidade de fotos.
5. Mensagens claras para cada situação: QR inválido, código ausente na URL, carregando, nenhuma foto vendida, falha na consulta e falha ao carregar uma miniatura específica.

## Detalhes técnicos

- `src/features/roverpix/config.ts`: trocar o identificador da organização para `6d8fdfde-32a9-4b63-bebc-3df2963e20a0`.
- `src/features/roverpix/api.ts`:
  - substituir `extractSessionId` por leitura de `new URL(qr).searchParams.get("card")`, retornando um resultado que distingue "URL inválida" de "parâmetro card ausente";
  - manter `buildMediasUrl` e `buildThumbUrl` nos formatos indicados.
- `src/features/roverpix/useRoverpixMedias.ts`: adicionar o estado `missing-card` além dos existentes.
- `src/pages/Scanner.tsx`: textos novos do bloco de sucesso, mensagem para código ausente e fallback visual por imagem quando uma miniatura falhar (`onError`).

Sem AR, 3D, login, banco de dados, download ou armazenamento nesta etapa.
