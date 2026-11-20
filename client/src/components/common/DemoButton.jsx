import { Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";

const DEMO_CREDENTIALS = { email: "demo@example.com", password: "demo1234" };

export default function DemoButton({
  className = "btn-secondary px-6 py-3 text-base",
  redirectTo = "/recipes",
}) {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const user = await login(DEMO_CREDENTIALS);
      toast.success(
        `Welcome, ${user.name.split(" ")[0]}! You are using the demo account.`,
      );
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      <Play className="h-4 w-4" aria-hidden="true" />
      {loading ? "Starting demo…" : "Try demo"}
    </button>
  );
}
