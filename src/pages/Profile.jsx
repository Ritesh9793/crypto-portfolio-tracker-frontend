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
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!isAuthenticated && !isDemo) {
    return (
      <DashboardLayout>
        <div className="app-page text-[#cbbca5]">Please log in or try demo.</div>
      </DashboardLayout>
    );
  }

  const displayData = isDemo ? { email: "demo@example.com", name: "Demo User" } : profile;

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Account</span>
            <h2 className="page-title">Manage your profile</h2>
            <p className="page-subtitle">
              Review account details, update profile information, and control access
              to the workspace.
            </p>
          </div>
        </div>

        {isDemo && (
          <div className="mb-6 rounded-2xl border border-[rgba(250,204,21,0.18)] bg-[rgba(113,63,18,0.14)] p-4 text-sm text-[#fde68a]">
            Demo mode: profile information is read-only sample data.
          </div>
        )}

        <div className="max-w-3xl app-card p-8">
          {displayData && (
            <div className="space-y-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d39b34,#915b0a)] text-2xl font-semibold text-white">
                  {displayData.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#f7f2e8]">
                    {displayData.name || "User"}
                  </h3>
                  <p className="mt-2 text-sm text-[#cbbca5]">{displayData.email}</p>
                </div>
              </div>

              {!editing ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoBlock label="Full name" value={displayData.name || "N/A"} />
                    <InfoBlock label="Email" value={displayData.email || "N/A"} />
                    <InfoBlock
                      label="Member since"
                      value={
                        displayData.createdAt
                          ? new Date(displayData.createdAt).toLocaleDateString()
                          : "N/A"
                      }
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditing(true);
                      setFormData(displayData);
                    }}
                    disabled={isDemo}
                    className={`app-button-primary w-full px-6 py-3 ${
                      isDemo ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  >
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-5">
                    <Field
                      label="Full name"
                      value={formData.name || ""}
                      onChange={(value) => setFormData({ ...formData, name: value })}
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(value) => setFormData({ ...formData, email: value })}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="app-button-primary flex-1 px-6 py-3 disabled:opacity-60"
                    >
                      {loading ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="app-button-secondary flex-1 px-6 py-3 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={handleLogout}
                className="app-button-danger w-full px-6 py-3 text-sm font-semibold"
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

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4">
      <p className="text-sm text-[#9d8c73]">{label}</p>
      <p className="mt-2 text-[#f7f2e8]">{value}</p>
    </div>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#cbbca5]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="app-input px-4 py-3"
      />
    </div>
  );
}

export default Profile;
