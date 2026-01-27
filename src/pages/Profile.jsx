import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { DemoContext } from "../context/DemoContext";
import DashboardLayout from "../layout/DashboardLayout";

const Profile = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { isDemo } = useContext(DemoContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDemo && isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, isDemo]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile/get-profile");
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (isDemo) {
      toast.error("Demo mode: Cannot update profile");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/profile/update-profile", formData);
      setProfile(formData);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!isAuthenticated && !isDemo) {
    return (
      <DashboardLayout>
        <div className="p-10 text-gray-400">Please log in or try demo.</div>
      </DashboardLayout>
    );
  }

  const displayData = isDemo
    ? { email: "demo@example.com", name: "Demo User" }
    : profile;

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen text-white bg-gradient-to-br from-black via-[#06010d] to-black">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        {isDemo && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300">
            Demo mode: Profile is mock data
          </div>
        )}

        <div className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {displayData && (
            <div className="space-y-6">
              {/* PROFILE AVATAR */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                  {displayData.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {displayData.name || "User"}
                  </h2>
                  <p className="text-gray-400">{displayData.email}</p>
                </div>
              </div>

              {/* EDITABLE FIELDS */}
              {!editing ? (
                <>
                  <div className="space-y-3 text-gray-300">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <p>{displayData.name || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p>{displayData.email || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">
                        Member Since
                      </label>
                      <p>
                        {displayData.createdAt
                          ? new Date(displayData.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditing(true);
                      setFormData(displayData);
                    }}
                    disabled={isDemo}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isDemo
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-pink-500 text-white hover:bg-pink-600"
                    }`}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-3 bg-white/10 text-gray-300 rounded-lg font-semibold hover:bg-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 border border-red-500/30"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
