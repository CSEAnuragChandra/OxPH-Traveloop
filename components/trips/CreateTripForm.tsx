"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Wallet,
  Image as ImageIcon,
  ArrowRight,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COVER_PRESETS = [
  {
    label: "Mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
  },
  {
    label: "Beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  },
  {
    label: "City",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
  },
  {
    label: "Forest",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
  },
  {
    label: "Desert",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80",
  },
  {
    label: "Europe",
    url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80",
  },
];

const createTripSchema = z
  .object({
    title: z.string().min(1, "Trip title is required").max(120),
    description: z.string().max(500).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    totalBudget: z.string().optional(),
    coverPhoto: z.string().optional(),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type CreateTripValues = z.infer<typeof createTripSchema>;

export default function CreateTripForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0].url);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: { coverPhoto: COVER_PRESETS[0].url },
  });

  const onSubmit = async (values: CreateTripValues) => {
    setFormError(null);
    try {
      const body = {
        title: values.title,
        description: values.description || undefined,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        totalBudget: values.totalBudget ? parseFloat(values.totalBudget) : undefined,
        coverPhoto: selectedCover || undefined,
      };

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setFormError(payload?.error || "Failed to create trip. Please try again.");
        return;
      }

      const trip = await res.json();
      router.push(`/trips/${trip.id}`);
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-orange-500" />
              Trip Name
            </Label>
            <Input
              id="title"
              placeholder="e.g. Japan Spring Adventure"
              className="h-11"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-orange-500" />
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <textarea
              id="description"
              rows={3}
              placeholder="What's this trip about?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-orange-500" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                min={today}
                className="h-11"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-orange-500" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                min={today}
                className="h-11"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="totalBudget" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Wallet className="w-4 h-4 text-orange-500" />
              Estimated Budget (USD) <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <Input
                id="totalBudget"
                type="number"
                placeholder="2500"
                min={0}
                className="h-11 pl-7"
                {...register("totalBudget")}
              />
            </div>
          </div>

          {/* Error message */}
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-md shadow-orange-200 transition-all group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Creating your trip...
              </>
            ) : (
              <>
                <MapPin className="mr-2 w-4 h-4" />
                Create Trip
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>

        {/* RIGHT: Cover Photo Picker */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              Cover Photo
            </Label>
            {/* Preview */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCover}
                alt="Trip cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
          {/* Preset grid */}
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Choose a style</p>
          <div className="grid grid-cols-3 gap-2">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => {
                  setSelectedCover(preset.url);
                  setValue("coverPhoto", preset.url);
                }}
                className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedCover === preset.url
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-transparent hover:border-orange-300"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white font-semibold drop-shadow">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            You can update the cover photo anytime from the trip settings.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
