import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center">
    <h1 className="font-display text-3xl uppercase tracking-widest text-primary">404</h1>
    <p className="text-muted-foreground">Página não encontrada.</p>
    <Link to="/" className="text-primary underline">
      Voltar ao scanner
    </Link>
  </main>
);

export default NotFound;
