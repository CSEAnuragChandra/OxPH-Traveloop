"use client";

import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Globe,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  UploadCloud,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type TripCard = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  coverPhoto: string;
};

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  languagePref: string | null;
};

type ProfileClientProps = {
  user: UserProfile;
  upcomingTrips: TripCard[];
  previousTrips: TripCard[];
};

const cardVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

function formatRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const endFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startFormatter.format(start)} - ${endFormatter.format(end)}`;
}

export default function ProfileClient({
  user,
  upcomingTrips,
  previousTrips,
}: ProfileClientProps) {
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: user.name ?? "",
    image: user.image ?? "",
    languagePref: user.languagePref ?? "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const initials = useMemo(() => {
    const source = profile.name || profile.email || "Traveler";
    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.name, profile.email]);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    setProfileMessage(null);

    const payload: {
      name?: string;
      image?: string | null;
      languagePref?: string | null;
    } = {};

    const name = profileForm.name.trim();
    const image = profileForm.image.trim();
    const languagePref = profileForm.languagePref.trim();

    if (name) {
      payload.name = name;
    }

    if (image) {
      payload.image = image;
    } else {
      payload.image = null;
    }

    if (languagePref) {
      payload.languagePref = languagePref;
    }

    if (!Object.keys(payload).length) {
      setProfileMessage("Add at least one field to update.");
      setIsUpdating(false);
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setProfileMessage(result?.error || "Unable to update profile.");
      setIsUpdating(false);
      return;
    }

    setProfile(result);
    setProfileForm({
      name: result.name ?? "",
      image: result.image ?? "",
      languagePref: result.languagePref ?? "",
    });
    setProfileMessage("Profile updated.");
    setIsEditing(false);
    setIsUpdating(false);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setUploadMessage(result?.error || "Unable to upload image.");
      setIsUploading(false);
      event.target.value = "";
      return;
    }

    setProfile(result.user);
    setProfileForm((prev) => ({
      ...prev,
      image: result.user?.image ?? "",
    }));
    setUploadMessage("Profile photo updated.");
    setIsUploading(false);
    event.target.value = "";
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPasswordUpdating(true);
    setPasswordMessage(null);

    const response = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setPasswordMessage(result?.error || "Unable to update password.");
      setIsPasswordUpdating(false);
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage("Password updated.");
    setIsChangingPassword(false);
    setIsPasswordUpdating(false);
  };

  return (
    <>
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 right-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute top-36 left-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <p className="text-sm font-semibold text-orange-500">Profile</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Your Travel Profile
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Keep your traveler details up to date and track every journey from
              one space.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_2fr]">
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 p-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative h-28 w-28">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="User profile"
                      className="h-28 w-28 rounded-full object-cover border border-orange-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-2xl font-semibold flex items-center justify-center">
                      {initials}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.name || "Traveler"}
                  </h2>
                  <p className="text-sm text-gray-500">Active Member</p>
                </div>
                <div className="w-full rounded-2xl bg-orange-50/80 border border-orange-100 p-4 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-orange-500" />
                    {profile.email || "Email not set"}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4 text-orange-500" />
                    Preferred language: {profile.languagePref || "en"}
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="w-full space-y-3 text-left">
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Name
                      </label>
                      <input
                        value={profileForm.name}
                        onChange={(event) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Upload profile photo
                      </label>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm cursor-pointer">
                          <UploadCloud className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                        <span className="text-xs text-gray-500">
                          PNG or JPG up to 5MB.
                        </span>
                      </div>
                      {uploadMessage && (
                        <p className="mt-1 text-xs text-gray-500">
                          {uploadMessage}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Language
                      </label>
                      <input
                        value={profileForm.languagePref}
                        onChange={(event) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            languagePref: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="en"
                      />
                    </div>
                    {profileMessage && (
                      <p className="text-xs text-gray-500">{profileMessage}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full"
                        disabled={isUpdating}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isUpdating ? "Saving..." : "Save changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setIsEditing(false);
                          setProfileForm({
                            name: profile.name ?? "",
                            image: profile.image ?? "",
                            languagePref: profile.languagePref ?? "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}

                {isChangingPassword && (
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="w-full space-y-3 text-left"
                  >
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Current password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        New password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    {passwordMessage && (
                      <p className="text-xs text-gray-500">{passwordMessage}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full"
                        disabled={isPasswordUpdating}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {isPasswordUpdating ? "Updating..." : "Update password"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setIsChangingPassword(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Traveler insights
              </h3>
              <p className="mt-2 text-gray-600">
                Stay on track with your next plans and a quick profile snapshot.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Boutique stays",
                  "Local food tours",
                  "Sunrise hikes",
                  "City photography",
                  "Wellness retreats",
                  "Cultural festivals",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-950 text-white px-5 py-4">
                <p className="text-sm text-white/70">Upcoming trips</p>
                <p className="mt-2 text-xl font-semibold">
                  {upcomingTrips.length} experiences ahead
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Trips
              </h2>
              <p className="text-gray-600">
                Keep an eye on what is next in your calendar.
              </p>
            </div>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {upcomingTrips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 24px 45px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-3xl bg-white border border-orange-100"
              >
                <div className="relative h-44">
                  <img
                    src={trip.coverPhoto}
                    alt={trip.title}
                    className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {trip.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {formatRange(trip.startDate, trip.endDate)}
                  </div>
                  <Button variant="outline" className="mt-4 w-full rounded-full">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
            {!upcomingTrips.length && (
              <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-6 text-gray-600">
                No upcoming trips yet. Start planning to fill this space.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Previous Trips
            </h2>
            <p className="text-gray-600">
              Relive the journeys you already conquered.
            </p>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {previousTrips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 24px 45px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-3xl bg-white border border-orange-100"
              >
                <div className="relative h-44">
                  <img
                    src={trip.coverPhoto}
                    alt={trip.title}
                    className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {trip.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {formatRange(trip.startDate, trip.endDate)}
                  </div>
                  <Button variant="outline" className="mt-4 w-full rounded-full">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
            {!previousTrips.length && (
              <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-6 text-gray-600">
                No previous trips yet. Your travel history will appear here.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
