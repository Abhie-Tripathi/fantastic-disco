"use client";
import PresetBase from "./Presets";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";

interface Props {
  isPublic?: boolean;
  // Add other props as needed
}

const PublicPresets = (props: Props) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const segments = [
    { label: "Solutions", href: "https://whr.ai/gtm/solutions", external: true },
    { label: "Tracker", href: "https://whr.ai/gtm/solutions/competitor-tracking", external: true },
    { label: "Collection", href: "/usercollection", external: false },
  ];

  return (
    <div 
      ref={containerRef} 
      className="h-[calc(100vh-73px)] overflow-y-auto"
    >
      {props.isPublic && (
        <div className="mx-[2.5%] flex gap-2 text-xs mt-3">
          {segments.map((segment, index) => {
            const isActive = !segment.external && pathname === segment.href;
            const className = `text-[var(--secondary-text-color)] hover:underline hover:text-black ${
              isActive ? "font-semibold" : ""
            }`;

            return (
              <div key={segment.href} className="flex items-center gap-1">
                {segment.external ? (
                  <a
                    href={segment.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {segment.label}
                  </a>
                ) : (
                  <Link href={segment.href} className={className}>
                    {segment.label}
                  </Link>
                )}
                {index < segments.length - 1 && (
                  <span className="text-[var(--secondary-text-color)]">{">"}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mx-[2.5%] text-[40px] max-[775px]:text-[28px]">
        {props.isPublic && (
          <>
            <div>User Collections</div>
            <div 
              className="text-[#171717] md:text-lg text-wrap break-words" 
              style={{
                color: "var(--secondary-text-color)", 
                fontSize: "14px"
              }}
            >
              Activate intelligence with agents that gather and deliver precise data.
            </div>
          </>
        )}
      </div>
      
      <PresetBase
        {...props}
        containerRef={containerRef}
        isFull={true}
      />
    </div>
  );
};

export default PublicPresets;