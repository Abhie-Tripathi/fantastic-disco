import React from 'react';
import GoTo from "@/public/goTo.svg";
import Image from 'next/image';
import Link from 'next/link';

interface CardWidgitConfigProps {
  heading: string;
  content: string;
  imgUrl?: string;
  redirectUrl: string;
}

const CardWidgitConfig: React.FC<CardWidgitConfigProps> = ({
  heading,
  imgUrl,
  content,
  redirectUrl,
}) => {
  return redirectUrl.length > 0 ? (
    <Link 
      href={redirectUrl} 
      className="flex flex-col gap-2 border rounded-[12px] p-4 w-[100%] border-[var(--border-color)] bg-[var(--primary-foreground)]"
    >
      <ManageAccessContent heading={heading} content={content} imgUrl={imgUrl} />
    </Link>
  ) : (
    <div 
      className="flex flex-col gap-2 border rounded-[12px] p-4 w-[100%] border-[var(--border-color)] bg-[var(--primary-foreground)]"
    >
      <ManageAccessContent heading={heading} content={content} imgUrl={imgUrl} />
    </div>
  );
};

const ManageAccessContent = ({ heading, content, imgUrl }: { heading: string; content: string; imgUrl?: string }) => (
  <>
    <div className="flex justify-between gap-4" style={{ color: "var(--primary-color)" }}>
      <div className="font-semibold">{heading}</div>
    </div>

    <div className="flex flex-col gap-4">
      <div className="text-[var(--secondary-text-color)] text-sm">{content}</div>
    </div>

    {/* {imgUrl && (
      <div style={{ position: "absolute", right: "15%", top: "25%", opacity: 0.15 }}>
        <Image src={imgUrl} alt="widget illustration" width={100} height={100} />
      </div>
    )} */}
  </>
);

export default CardWidgitConfig;
