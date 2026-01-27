import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { DemoContext } from "../context/DemoContext";

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isDemo } = useContext(DemoContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================
  // Fetch Profile
  // =============================
  const fetchProfile = async () => {
    if (isDemo) {
      setProfile({
        name: "Demo User",
        email: "demo@crypto.com",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/api/profile/get-profile");
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated || isDemo) {
      fetchProfile();
    }
  }, [isAuthenticated, isDemo]);

  // =============================
  // Actions
  // =============================
  const updateProfile = async () => {
    if (isDemo) return alert("Demo mode: action disabled");

    await api.post("/api/profile/update-profile");
    alert("Profile updated");
  };

  const changePassword = async () => {
    if (isDemo) return alert("Demo mode: action disabled");

    await api.post("/api/profile/change-password");
    alert("Password changed");
  };

  const setPreferences = async () => {
    if (isDemo) return alert("Demo mode: action disabled");

    await api.post("/api/profile/set-preferences");
    alert("Preferences saved");
  };

  const deleteAccount = async () => {
    if (isDemo) return alert("Demo mode: action disabled");

    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    await api.post("/api/profile/delete-account");
    alert("Account deleted");
  };

  // =============================
  // Guards
  // =============================
  if (!isAuthenticated && !isDemo) {
    return <div>Please log in or try demo.</div>;
  }

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  // =============================
  // UI
  // =============================
  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {isDemo && (
        <p className="text-sm text-orange-500 mb-3">
          Demo mode: Data is mocked
        </p>
      )}

      {profile && (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </>
      )}

      <div className="mt-6 space-y-2">
        <button onClick={updateProfile} className="btn">
          Update Profile
        </button>

        <button onClick={changePassword} className="btn">
          Change Password
        </button>

        <button onClick={setPreferences} className="btn">
          Set Preferences
        </button>

        <button
          onClick={deleteAccount}
          className="btn bg-red-500 text-white"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
