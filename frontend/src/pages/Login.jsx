import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      navigate(`/dashboard?uid=${user.uid}`);
    } catch (err) {
      console.error("Erro no login Google:", err.code);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070710] px-6 text-white">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#111318] p-6 shadow-[0_0_45px_rgba(124,58,237,0.18)]">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <img src={logo} alt="ELAN" className="h-9 w-9" />
          <span className="text-xl font-bold">ELAN</span>
        </Link>

        <h1 className="text-2xl font-semibold">Entrar na plataforma</h1>
        <p className="mt-2 text-sm text-gray-400">
          O login libera Dashboard, histórico e recursos salvos.
        </p>

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold transition hover:bg-purple-500"
        >
          Login com Google
        </button>

        <Link to="/" className="mt-4 block text-center text-sm text-gray-400 hover:text-white">
          Voltar para home
        </Link>
      </div>
    </div>
  );
}
