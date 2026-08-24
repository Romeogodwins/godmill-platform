"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

interface GalleryImage {
  id: string;
  storage_path: string;
  public_url: string;
  title: string;
  caption: string | null;
  alt_text: string;
  category: string;
  is_featured: boolean;
  is_cover: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const categories = [
  { value: "executive", label: "Executive Room" },
  { value: "standard-aircon", label: "Standard Room - Aircon" },
  {
    value: "standard-non-aircon",
    label: "Standard Room - Non Aircon",
  },
  {
    value: "family-aircon",
    label: "Family / 3 Sleeper - Aircon",
  },
  {
    value: "family-non-aircon",
    label: "Family / 3 Sleeper - Non Aircon",
  },
  { value: "bathroom", label: "Bathroom" },
  { value: "pool", label: "Swimming Pool" },
  { value: "courtyard", label: "Courtyard" },
  { value: "dining", label: "Dining" },
  { value: "exterior", label: "Exterior" },
  { value: "general", label: "General" },
];

function categoryLabel(value: string) {
  return (
    categories.find(
      (category) => category.value === value
    )?.label ?? value
  );
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("general");
  const [sortOrder, setSortOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isCover, setIsCover] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/gallery", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load gallery."
        );
      }

      setImages(result.images ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load gallery."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function resetForm() {
    setFile(null);
    setPreview("");
    setTitle("");
    setCaption("");
    setAltText("");
    setCategory("general");
    setSortOrder(0);
    setIsFeatured(false);
    setIsCover(false);
    setIsPublished(true);

    const input = document.getElementById(
      "gallery-file"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  async function handleUpload(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a photo.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "title",
        title || "Godmill City Guesthouse"
      );
      formData.append("caption", caption);
      formData.append(
        "altText",
        altText ||
          title ||
          "Godmill City Guesthouse"
      );
      formData.append("category", category);
      formData.append(
        "sortOrder",
        String(sortOrder)
      );
      formData.append(
        "isFeatured",
        String(isFeatured)
      );
      formData.append(
        "isCover",
        String(isCover)
      );
      formData.append(
        "isPublished",
        String(isPublished)
      );

      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Upload failed."
        );
      }

      setMessage("Photo uploaded successfully.");
      resetForm();
      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function updateImage(
    image: GalleryImage,
    updates: Record<string, unknown>
  ) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: image.id,
            ...updates,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update photo."
        );
      }

      setMessage("Gallery updated.");
      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update photo."
      );
    }
  }

  async function deleteImage(image: GalleryImage) {
    const confirmed = window.confirm(
      `Delete "${image.title}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: image.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete photo."
        );
      }

      setMessage("Photo deleted.");
      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete photo."
      );
    }
  }

 return (
  <main className="min-h-screen bg-[#080808] p-6 text-white lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">
                Website Content
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Gallery Manager
              </h1>

              <p className="mt-3 max-w-2xl text-gray-400">
                Upload guesthouse photographs, assign them
                to rooms or facilities and control which
                images appear on the website.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] px-5 py-4">
              <p className="text-sm text-gray-400">
                Total photographs
              </p>

              <p className="mt-1 text-2xl font-bold text-[#d4b16f]">
                {images.length}
              </p>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
            {/* Upload panel */}
            <form
              onSubmit={handleUpload}
              className="h-fit rounded-3xl border border-white/10 bg-[#111111] p-6"
            >
              <h2 className="text-xl font-semibold">
                Upload New Photo
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or WEBP. Maximum 10 MB.
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium text-gray-300">
                  Photo
                </label>

                <input
                  id="gallery-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setFile(
                      event.target.files?.[0] ?? null
                    )
                  }
                  className="mt-2 block w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-gray-300"
                />
              </div>

              {preview && (
                <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={preview}
                    alt="Selected photo preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white"
                >
                  {categories.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Photo title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Example: Executive Room"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#d4b16f]/60"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(event) =>
                    setCaption(event.target.value)
                  }
                  placeholder="Optional description"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#d4b16f]/60"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Image description / alt text
                </label>

                <input
                  value={altText}
                  onChange={(event) =>
                    setAltText(event.target.value)
                  }
                  placeholder="Example: Executive room at Godmill City Guesthouse"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#d4b16f]/60"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Display order
                </label>

                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      Number(event.target.value)
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#d4b16f]/60"
                />
              </div>

              <div className="mt-6 space-y-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) =>
                      setIsPublished(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                  Show this photo on the website
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(event) =>
                      setIsFeatured(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                  Feature on homepage
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isCover}
                    onChange={(event) =>
                      setIsCover(event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Make category cover photo
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="mt-7 w-full rounded-full bg-[#d4b16f] px-6 py-4 font-bold text-black transition hover:bg-[#e2c17d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Photo"}
              </button>
            </form>

            {/* Existing photos */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Website Photos
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage published, featured and cover
                    photographs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadImages}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-gray-300 transition hover:border-[#d4b16f]/50 hover:text-[#d4b16f]"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-10 text-center text-gray-400">
                  Loading gallery...
                </div>
              ) : images.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-[#111111] p-12 text-center">
                  <p className="text-xl font-semibold">
                    No uploaded photos yet
                  </p>

                  <p className="mt-2 text-gray-500">
                    Use the upload form to add your first
                    managed gallery photo.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {images.map((image) => (
                    <article
                      key={image.id}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={image.public_url}
                          alt={image.alt_text}
                          fill
                          unoptimized
                          className="object-cover"
                        />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {image.is_cover && (
                            <span className="rounded-full bg-[#d4b16f] px-3 py-1 text-xs font-bold text-black">
                              COVER
                            </span>
                          )}

                          {image.is_featured && (
                            <span className="rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
                              FEATURED
                            </span>
                          )}

                          {!image.is_published && (
                            <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
                              HIDDEN
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b16f]">
                          {categoryLabel(
                            image.category
                          )}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {image.title}
                        </h3>

                        {image.caption && (
                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {image.caption}
                          </p>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateImage(image, {
                                isPublished:
                                  !image.is_published,
                              })
                            }
                            className="rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-gray-300 hover:border-[#d4b16f]/40"
                          >
                            {image.is_published
                              ? "Hide"
                              : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateImage(image, {
                                isFeatured:
                                  !image.is_featured,
                              })
                            }
                            className="rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-gray-300 hover:border-[#d4b16f]/40"
                          >
                            {image.is_featured
                              ? "Remove Featured"
                              : "Feature"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateImage(image, {
                                isCover: true,
                              })
                            }
                            className="rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-gray-300 hover:border-[#d4b16f]/40"
                          >
                            Set Cover
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteImage(image)
                            }
                            className="rounded-xl border border-red-500/20 px-3 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
        </main>
  );
}