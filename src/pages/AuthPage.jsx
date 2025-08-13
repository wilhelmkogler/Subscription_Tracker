import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleAuth}
        className="bg-white px-8 py-6 rounded-2xl shadow-md w-full max-w-sm xl:max-w-md"
      >
        <h2 className="text-3xl text-primary font-bold my-10 text-center">
          {isRegistering ? "Sign Up" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {isRegistering ? "Create Account" : "Enter Dashboard"}
        </button>

        <p
          className="text-sm text-center mt-4 text-black cursor-pointer hover:scale-110 transition duration-200"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Login here"
            : "No account? Register here"}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
