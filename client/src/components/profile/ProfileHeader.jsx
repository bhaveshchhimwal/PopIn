import React from "react";
import profileIcon from "../../assets/profile.png";

export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-4">
      <img
        src={profileIcon}
        alt="profile"
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
      />
      <div>
        <h2 className="text-base sm:text-lg font-semibold break-words">
          {user.fullName ?? user.name ?? user.email}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Role: <span className="font-medium">{user.role ?? "user"}</span>
        </p>
      </div>
    </div>
  );
}