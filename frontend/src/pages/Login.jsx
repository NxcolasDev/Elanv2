import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../services/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    await axios.post("http://localhost:5000/api/users/sync", {
      firebaseUid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });

    // ✔ forma limpa
   navigate(`/dashboard?uid=${user.uid}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <button
        onClick={handleLogin}
        className="bg-primary px-6 py-3 rounded-xl"
      >
        Login com Google
      </button>
    </div>
  );
}