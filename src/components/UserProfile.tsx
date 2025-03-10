import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  const renderAvatar = () => {
    if (!user.user_metadata?.avatar_url || imageError) {
      return (
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
          {(user.email?.[0] || "U").toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={user.user_metadata.avatar_url}
        alt="User avatar"
        className="w-8 h-8 rounded-full object-cover"
        onError={handleImageError}
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity px-6"
      >
        {renderAvatar()}
        <span className="text-sm text-gray-200">
          {user.user_metadata?.full_name || user.email}
        </span>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-zax-bg border border-zax-button rounded-lg shadow-lg z-20">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-purple-600/20 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
