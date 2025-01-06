import { useEffect, useState, useRef, RefObject } from "react";
import Image from "next/image";
import styles from "./filters.style.module.css";
import Competitor from "/public/competitor.svg";
import Keywords from "/public/keywords.svg";
import Speaking from "/public/speaking.svg";
import Template from "/public/template.svg";
// import kewwordPresetJson from "@/public/data/presetJson/keyword.json";
// import competitorPresetJson from "@/public/data/presetJson/competitor.json";
// import speakerPresetJson from "@/public/data/presetJson/speaker.json";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import Loading from "@/app/components/UI/Loading";
import { useCoordinateService } from "@/services/coordinateService";
import { PresetJsonData } from "@/types/coordinateEventType";

interface Props {
  template: any;
  handlePresetClick: any;
}

const formatCount = (count: number) => {
  if (count >= 1000) {
    const value = count / 1000;
    const decimalPart = value - Math.floor(value);
    return `${Math.floor(value)}k`;
  }
  return count;
};

const Presets = ({ template, handlePresetClick }: Props) => {
  const [presetTemplateData, setPresetTemplateData] = useState<
    PresetJsonData[]
  >([]);

  const [shortlistPage, setShortlistPage] = useState(1);
  const shortlistRef: RefObject<HTMLDivElement> = useRef(null);
  const [count, setCount] = useState<number>(0);

  const coordinateService = useCoordinateService();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScrollEnd = () => {

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (presetTemplateData.length < count)
        setShortlistPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  useInfiniteScroll(shortlistRef, handleScrollEnd);

  const fetchPresetJson = async () => {
    try {
      const apiData = await coordinateService.getPresetJson(
        template?.name,
        shortlistPage
      );
      if (apiData) {
        setPresetTemplateData((prev) => [...prev, ...apiData.data]);
        setCount(apiData.totalCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPresetJson();
  }, [shortlistPage]);

  return (
    <div>
      <div className="flex justify-center	gap-2 items-center font-semibold">
        <span className="text-lg">Get Started with Pre-sets </span>{" "}
        <span className="text-xs bg-[var(--primary-color)] text-white py-[3px] px-2 rounded-full">
          {count}
        </span>
      </div>
      <div
        className="max-h-[calc(100vh-260px)] overflow-y-auto mt-6"
        ref={shortlistRef}
      >
        <div className={styles.presetContainer}>
          {presetTemplateData
            .filter((item) => item.url === template?.name)
            .map((item, ind) => (
              <div
                key={ind}
                className="w-full p-2 gap-3 flex items-center flex-col h-[280px] text-sm border border-[var(--border-color)] rounded-[12px] overflow-y-auto"
                onClick={
                  item.enabled
                    ? () =>
                        handlePresetClick(
                          item,
                          item.id,
                          item.url,
                          item.trackerName
                        )
                    : undefined
                }
                style={{ cursor: item.enabled ? "pointer" : "unset" }}
              >
                <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)] relative">
                  <div className={styles.account}>
                    <Image
                      src={
                        item.url === "T_COMPETITOR"
                          ? Competitor
                          : item.url === "T_PRODUCT_KEYWORDS"
                          ? Keywords
                          : item.url === "T_SPEAKING_OPPORTUNITY"
                          ? Speaking
                          : Keywords
                      }
                      alt="people"
                    />
                  </div>
                  <div>
                    <Image src={Template} alt="template" />
                  </div>
                  {item?.eventCount && parseInt(item.eventCount) > 0 && (
                    <div className="p-1 px-2 bg-[var(--primary-light-color)] font-medium text-xs absolute bottom-0 right-0 rounded-br-md rounded-tl-md">
                      {formatCount(parseInt(item.eventCount))} events
                    </div>
                  )}
                </div>
                <div className="w-full h-[60%] flex flex-col gap-3">
                  {/* <div className="flex justify-between items-center">
                    <div className="flex h-full items-center gap-1">
                      <Image
                        src={Vector1}
                        alt="vector1"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <div style={{ color: "#585871", fontSize: "12px" }}>
                        PRE-SET
                      </div>
                    </div>
                    {item.enabled ? 
                      <div className={`${styles.domain}`} >
                        {item.presetType}
                      </div> :
                      <div className="badge_success" style={{fontSize: 'var(--font-size-xs)'}}>
                        Coming Soon
                      </div>
                    }
                  </div> */}
                  <div className={styles.bottomViewTwo}>
                    {item?.trackerName}
                  </div>
                  <div className={styles.text}>{item?.content}</div>
                </div>
              </div>
            ))}
        </div>
        {presetTemplateData.length < count && (
          <div className="flex justify-center p-5 w-full">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default Presets;
