import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = 32, showText = true, href = "/" }) {
  const content = (
    <div className="inline-flex items-center gap-2.5 font-bold tracking-tight text-stone-900 group">
      <div className="relative flex shrink-0 items-center justify-center transition-transform group-hover:scale-105">
        <Image
          src="/logo.svg"
          alt="StickyBrain logo"
          width={size}
          height={size}
          priority
        />
      </div>
      {showText && (
        <span className="text-xl font-black tracking-tight text-stone-900">
          Sticky<span className="text-orange-500">Brain</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

