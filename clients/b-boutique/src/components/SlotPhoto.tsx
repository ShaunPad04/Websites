"use client";

import NextImage from "next/image";
import { useState } from "react";

/* The photograph layer of an ImageSlot.
 *
 * Split out as a client component for one reason: a slot whose image fails to
 * load must fall back to the designed marble/cloth beneath it, not paint a
 * broken-image icon over the top of it. That needs an onError handler, and so
 * it needs to run on the client — but only this layer does, so the slot around
 * it stays a server component.
 *
 * The failure is real and worth handling: the art direction is served from a
 * third-party CDN, which a corporate network, a blocker, or an outage can all
 * take away. */
export function SlotPhoto({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority: boolean;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  // Vendored in public/: next/image can encode AVIF/WebP and emit a srcset,
  // so it gets the real treatment. `fill` needs a positioned parent, which the
  // slot wrapper provides.
  if (src.startsWith("/")) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ color: "transparent" }}
        onError={() => setFailed(true)}
      />
    );
  }

  // Remote: the origin is unreachable from the build environment, so the
  // optimiser would fail on it. Serve it directly.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      style={{ color: "transparent" }}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
