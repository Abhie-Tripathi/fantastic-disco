import { InformationFill } from "geist-icons";

export const Heading = ({
  heading,
  scrollSection,
}: {
  heading: string;
  scrollSection?: string;
}) => {
  return (
    <div
      className={`flex items-center gap-4 bg-[#FAFAFA] py-3 px-4 font-bold ${scrollSection} dark:bg-[var(--heading-background-color)]`}
    >
      {heading}
      {/* <InformationFill color="#666666" width="12px" height="12px" /> */}
    </div>
  );
};
