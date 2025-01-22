import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

export const SectionHeading = ({
  heading,
  scrollSection,
  setActiveTab,
}: {
  heading: string;
  scrollSection?: string;
  setActiveTab?: any;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab && setActiveTab(scrollSection);
    }
  }, [inView]);

  return (
    <div
      className={`flex items-center gap-4 bg-[#FAFAFA] py-3 px-4 font-bold ${scrollSection} dark:bg-[var(--heading-background-color)]`}
      ref={ref}
    >
      {heading}
      {/* <InformationFill color="#666666" width="12px" height="12px" /> */}
    </div>
  );
};
