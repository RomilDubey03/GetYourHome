import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { googleAuth } from "../authSlice.js";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const googleData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        idToken: await result.user.getIdToken()
      };

      const resultAction = await dispatch(googleAuth(googleData));

      if (googleAuth.fulfilled.match(resultAction)) {
        navigate("/");
      }
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors font-medium"
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </button>
  );
}