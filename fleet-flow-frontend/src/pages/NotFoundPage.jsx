import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-200 leading-none select-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95"
        >
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
