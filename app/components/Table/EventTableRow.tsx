import type React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, getLeastRank, getEventRating } from "@/utils/eventHelpers";
import Link from "next/link";
import { ArrowUp, ArrowDown, Star } from "lucide-react";
import styles from "./table.module.css";
import { Event } from "@/types/events";
import Image from "next/image";

export function getEventRank(prop: any) {
  let rankString = "";
  if (prop.rank == 1) rankString = "st";
  else if (prop.rank == 2) rankString = "nd";
  else if (prop.rank == 3) rankString = "rd";
  else rankString = "th";
  return (
    <>
      <div style={{ textAlign: "center", fontWeight: "500" }}>
        {prop.rank}
        <sup>{rankString}</sup>
      </div>
      <span
        title={prop.name}
        className={`${styles.truncateText_1} badge_warning`}
        style={{ textTransform: "capitalize", padding: "1px 10px" }}
      >
        {prop.type}
      </span>
    </>
  );
}

interface EventTableRowProps {
  event: Event;
}

function listProducts(data: string[]) {
  const formattedString = data.join(" | ");
  return formattedString;
}

function getForecastedStatus(data: any) {
  if (!data && data === "") return "-";

  const forecastDate = new Date(data);
  const today = new Date();

  if (forecastDate >= today) {
    return forecastDate.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } else return "-";
}

export const EventTableRow: React.FC<EventTableRowProps> = ({ event }) => (
  <TableRow key={event.basic.id}>
    <TableCell
      className={`${styles.table_actionColumn}`}
      style={{
        left: "0",
        textAlign: "left",
        boxShadow: "10px 0 15px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className={styles.event_badge_container}>
        {event.advance?.isBranded && (
          <span className={`${styles.branded_tag} badge_success`}>Brand</span>
        )}
        {event.advance?.isSeries && (
          <span className={`${styles.branded_tag} badge_info`}>Series</span>
        )}
      </div>
      <div className={styles.truncateText_1}>
        <Link href={`/internal/event/${event.basic.id}`} target="_blank">
          {event.basic.name}
        </Link>
      </div>
      <div className={styles.event_organizer}>
        {event.basic.organizer?.name}
      </div>
    </TableCell>
    <TableCell>
      {event.basic.status === "CANCELLED" ||
      event.basic.status === "POSTPONED" ? (
        <del data-toggle="tooltip" title={event.basic.status}>
          {formatDate(event.basic.startDateTime)}
          <br />
          {formatDate(event.basic.startDateTime) !==
            formatDate(event.basic.endDateTime) &&
            formatDate(event.basic.endDateTime)}
        </del>
      ) : (
        <span style={{ whiteSpace: "nowrap" }}>
          {formatDate(event.basic.startDateTime)}
          <br />
          {formatDate(event.basic.startDateTime) !==
            formatDate(event.basic.endDateTime) &&
            formatDate(event.basic.endDateTime)}
        </span>
      )}
    </TableCell>
    <TableCell>
      {event.basic.format === "HYBRID" && (
        <div className={styles.hybridTag}>Hybrid</div>
      )}
      {event.basic.eventLocation.venue?.displayName ||
        (event.basic.format === "ONLINE" ? "Online" : "TBA")}
    </TableCell>
    <TableCell>{event.basic.eventLocation.city?.name}</TableCell>
    <TableCell>{event.basic.eventLocation.country?.name}</TableCell>
    <TableCell>
      {event.basic.categories.length == 0 ? (
        <>-</>
      ) : event.basic.categories.length == 1 ? (
        event.basic.categories[0].name
      ) : (
        <>
          {event.basic.categories[0].name}&nbsp;
          
            {/* <TooltipTrigger>
              <Button className={styles["products-list"]}>
                +{event.basic.categories.length - 1}
            </Button>
            <Tooltip>
              {listProducts(event.basic.categories.map((c) => c.name))}
            </Tooltip>
          </TooltipTrigger> */}
        </>
      )}
    </TableCell>
    <TableCell>
      {/* Finance & Banking */}
      {event.basic.categories.filter((item) => item.slug === "finance-banking")
        .length == 1 ? (
        event.basic.categories.find((item) => item.slug === "finance-banking")
          ?.name
      ) : event.basic.categories.filter(
          (item) => item.slug === "finance-banking"
        ).length > 0 ? (
        <span style={{ textTransform: "capitalize" }}>
          {
            event.basic.categories.find(
              (item) => item.slug === "finance-banking"
            )?.name
          }
        </span>
      ) : (
        "-"
      )}
    </TableCell>
    <TableCell>{event.insights?.estimatedAttendance || "-"}</TableCell>

    <TableCell>{event.advance?.estimatedExhibitors || "-"}</TableCell>

    <TableCell style={{ textAlign: "center" }}>
      {event.insights?.rankings ? getLeastRank(event.insights.rankings) : "-"}
    </TableCell>
    <TableCell>
      {event.insights?.repeatSentiment !== undefined &&
      event.insights?.repeatSentiment !== null &&
      (event.insights?.repeatSentiment > 1 ||
        event.insights?.repeatSentiment < -1) ? (
        event.insights?.repeatSentiment > 0 ? (
          <div className={styles.text_green}>
            {event.insights?.repeatSentiment}% <ArrowUp className="w-4 h-4" />
          </div>
        ) : (
          <div className={styles.text_red}>
            {event.insights?.repeatSentiment}% <ArrowDown className="w-4 h-4" />
          </div>
        )
      ) : (
        <>-</>
      )}
    </TableCell>
    <TableCell style={{ textAlign: "center" }}>
      {event.insights?.reputationScore !== undefined &&
      event.insights?.reputationScore !== null &&
      event.insights?.reputationScore > 0 ? (
        <>
          {event.insights?.reputationScore > 10 && (
            <span
              style={{
                borderRadius: "50%",
                backgroundColor: "var(--success-background-color)",
                padding: "4px",
              }}
            >
              <ArrowUp
                style={{
                  width: "14px",
                  height: "14px",
                  color: "var(--success-text-color)",
                  marginBottom: "5px",
                  display: "inline",
                }}
              />
            </span>
          )}
          {event.insights?.reputationScore < -10 && (
            <span
              style={{
                borderRadius: "50%",
                backgroundColor: "var(--danger-background-color)",
                padding: "4px",
              }}
            >
              <ArrowDown
                style={{
                  width: "14px",
                  height: "14px",
                  color: "var(--danger-text-color)",
                  marginBottom: "5px",
                  display: "inline",
                }}
              />
            </span>
          )}
          &nbsp;
          {getEventRating(event.insights?.reputationScore.toString())}
          &nbsp;
          <Star className="w-4 h-4" />
        </>
      ) : (
        <>-</>
      )}
    </TableCell>
    {/* <TableCell style={{ textAlign: "center" }}>
        {event.insights?.repeatSentiment !== undefined && event.insights?.repeatSentiment > 0 ? (
          <>
            {event.insights?.trustScore !== undefined &&
              event.insights?.trustScore !== null && (
                <>
                  {event.insights?.trustScore > 10 && (
                    <span
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "var(--success-background-color)",
                        padding: "4px",
                      }}
                    >
                      <ArrowUp
                        style={{
                          width: "14px",
                          height: "14px",
                          color: "var(--success-text-color)",
                          marginBottom: "5px",
                          display: "inline",
                        }}
                      />
                    </span>
                  )}
                  {event.insights?.trustScore < -10 && (
                    <span
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "var(--danger-background-color)",
                        padding: "4px",
                      }}
                    >
                      <ArrowDown
                        style={{
                          width: "14px",
                          height: "14px",
                          color: "var(--danger-text-color)",
                          marginBottom: "5px",
                          display: "inline",
                        }}
                      />
                    </span>
                  )}
                </>
              )}
            &nbsp;
            {event.insights?.repeatSentiment}%
          </>
        ) : (
          "-"
        )}
      </TableCell> */}

    <TableCell className="text-center">
      {event.advance?.frequency && event.advance?.frequency !== "" ? (
        <span style={{ textTransform: "capitalize" }} className="badge_primary">
          {event.advance?.frequency}
        </span>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell>{getForecastedStatus(event.basic.startDateTime)}</TableCell>

    {/* {(type === null || type === "CUSTOM") && appliedKeywords?.length > 0 && (
      <>
        <TableCell>
          {event.basic.categories.length == 0 ? (
            <>-</>
          ) : event.basic.categories.length == 1 ? (
            event.basic.categories[0].name
          ) : (
            <>
              {event.basic.categories[0].name}&nbsp;
              <TooltipTrigger>
                <Button className={styles["products-list"]}>
                  +{event.basic.categories.length - 1}
                </Button>
                <Tooltip>{listProducts(event.basic.categories.map((c) => c.name))}</Tooltip>
              </TooltipTrigger>
            </>
          )}
        </TableCell>
        {(type === null || type === "CUSTOM") &&
          appliedKeywords?.length >= 5 && (
            <TableCell>
              {event.keywordsMatchedScore > 20 ? (
                <span className={styles.badge_success}>High</span>
              ) : event.keywordsMatchedScore >= 10 &&
                event.keywordsMatchedScore <= 20 ? (
                <span className={styles.badge_primary}>Medium</span>
              ) : event.keywordsMatchedScore > 0 &&
                event.keywordsMatchedScore < 10 ? (
                <span className={styles.badge_danger}>Low</span>
              ) : (
                "-"
              )}
            </TableCell>
          )}
      </>
    )} */}

    {/* {(type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP") &&
      path[path.length - 1] !== "savedEvents" && (
        <>
          <TableCell
            style={{
              textAlign: "center",
              right: "150px",
              boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
              minWidth: "60px",
            }}
            className={`${styles.table_actionColumn}`}
          >
            {event?.competitorDomainOrName &&
            event?.competitorDomainOrName.length > 0 ? (
              <>
                <span
                  title={event?.competitorDomainOrName?.[0].split("_")[1]}
                  className={styles.capitalizeText}
                >
                  {event?.competitorDomainOrName?.[0].split("_")[0]}
                </span>
                &nbsp;
                {event?.competitorDomainOrName.length > 1 && (
                  <TooltipTrigger>
                    <Button className={styles["products-list"]}>
                      +{event.competitorDomainOrName.length - 1}
                    </Button>
                    <Tooltip>
                      {event?.competitorDomainOrName.map((item) => (
                        <div key={item}>
                          {item.split("_")[1]}
                          <span className={styles.capitalizeText}>
                            {" "}
                            ({item.split("_")[0]})
                          </span>
                        </div>
                      ))}
                    </Tooltip>
                  </TooltipTrigger>
                )}
              </>
            ) : (
              "-"
            )}
          </TableCell>

          <TableCell
            style={{
              textAlign: "center",
              right: "50px",
              minWidth: "100px",
            }}
            className={`${styles.table_actionColumn}`}
          >
            {event?.competitorPercentage == "High" ? (
              <span className={styles.badge_success}>High</span>
            ) : event?.competitorPercentage == "Medium" ? (
              <span className={styles.badge_primary}>Medium</span>
            ) : event?.competitorPercentage == "Low" ? (
              <span className={styles.badge_danger}>Low</span>
            ) : (
              "-"
            )}
          </TableCell>
        </>
      )} */}

    {/* {type === "T_SPEAKING_OPPORTUNITY" &&
      path[path.length - 1] !== "savedEvents" && (
        <>
          <TableCell
            style={{
              textAlign: "center",
              right: "150px",
              boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
              minWidth: "60px",
            }}
            className={`${styles.table_actionColumn}`}
          >
            {event?.speakerPersonAssociation ? (
              event?.speakerPersonAssociation.length == 1 ? (
                event.speakerPersonAssociation[0]
              ) : (
                <>
                  {event.speakerPersonAssociation[0]}&nbsp;
                  <TooltipTrigger>
                    <Button className={styles["products-list"]}>
                      +{event.speakerPersonAssociation.length - 1}
                    </Button>
                    <Tooltip>
                      {listProducts(event.speakerPersonAssociation)}
                    </Tooltip>
                  </TooltipTrigger>
                </>
              )
            ) : (
              "-"
            )}
          </TableCell>

          <TableCell
            style={{
              textAlign: "center",
              right: "50px",
              minWidth: "100px",
            }}
            className={`${styles.table_actionColumn}`}
          >
            {event?.speakerPersonAssociationPercentage == "High" ? (
              <span className={styles.badge_success}>High</span>
            ) : event?.speakerPersonAssociationPercentage == "Medium" ? (
              <span className={styles.badge_primary}>Medium</span>
            ) : event?.speakerPersonAssociationPercentage == "Low" ? (
              <span className={styles.badge_danger}>Low</span>
            ) : (
              "-"
            )}
          </TableCell>
        </>
      )} */}

    {/* {type === "T_PRODUCT_KEYWORDS" &&
      path[path.length - 1] !== "savedEvents" && (
        <>
          <TableCell
            style={{
              textAlign: "center",
              right: appliedKeywords?.length >= 5 ? "150px" : "50px",
              boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
              minWidth: "60px",
            }}
            className={`${styles.table_actionColumn}`}
          >
            {event.basic.categories.length == 0 ? (
              <>-</>
            ) : event.basic.categories.length == 1 ? (
              event.basic.categories[0].name
            ) : (
              <>
                {event.basic.categories[0].name}&nbsp;
                <TooltipTrigger>
                  <Button className={styles["products-list"]}>
                    +{event.basic.categories.length - 1}
                  </Button>
                  <Tooltip>{listProducts(event.basic.categories.map((c) => c.name))}</Tooltip>
                </TooltipTrigger>
              </>
            )}
          </TableCell>
          {appliedKeywords?.length >= 5 && (
            <TableCell
              style={{
                textAlign: "center",
                right: "50px",
                minWidth: "100px",
              }}
              className={`${styles.table_actionColumn}`}
            >
              {event.keywordsMatchedScore > 20 ? (
                <span className={styles.badge_success}>High</span>
              ) : event.keywordsMatchedScore >= 10 &&
                event.keywordsMatchedScore <= 20 ? (
                <span className={styles.badge_primary}>Medium</span>
              ) : event.keywordsMatchedScore > 0 &&
                event.keywordsMatchedScore < 10 ? (
                <span className={styles.badge_danger}>Low</span>
              ) : (
                "-"
              )}
            </TableCell>
          )}
        </>
      )} */}

    {/* {type === "T_PEOPLE_FINDER" && path[path.length - 1] !== "savedEvents" && (
      <>
        <TableCell
          style={{
            textAlign: "center",
            right: "150px",
            boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
            minWidth: "60px",
          }}
          className={`${styles.table_actionColumn}`}
        >
          {event?.peopleFinderPersonAssociation &&
          event?.peopleFinderPersonAssociation.length > 0 ? (
            <>
              <span
                title={event?.peopleFinderPersonAssociation?.[0].split("_")[1]}
                className={styles.capitalizeText}
              >
                {event?.peopleFinderPersonAssociation?.[0].split("_")[0]}
              </span>
              &nbsp;
              {event?.peopleFinderPersonAssociation.length > 1 && (
                <TooltipTrigger>
                  <Button className={styles["products-list"]}>
                    +{event.peopleFinderPersonAssociation.length - 1}
                  </Button>
                  <Tooltip>
                    {event?.peopleFinderPersonAssociation.map((item) => (
                      <div key={item}>
                        {item.split("_")[1]}
                        <span className={styles.capitalizeText}>
                          {" "}
                          ({item.split("_")[0]})
                        </span>
                      </div>
                    ))}
                  </Tooltip>
                </TooltipTrigger>
              )}
            </>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell
          style={{
            textAlign: "center",
            right: "50px",
            minWidth: "100px",
          }}
          className={`${styles.table_actionColumn}`}
        >
          {event?.peopleFinderPersonAssociationPercentage == "High" ? (
            <span className={styles.badge_success}>High</span>
          ) : event?.peopleFinderPersonAssociationPercentage == "Medium" ? (
            <span className={styles.badge_primary}>Medium</span>
          ) : event?.peopleFinderPersonAssociationPercentage == "Low" ? (
            <span className={styles.badge_danger}>Low</span>
          ) : (
            "-"
          )}
        </TableCell>
      </>
    )} */}

    {/* {type === "T_RECRUITMENT" && path[path.length - 1] !== "savedEvents" && (
      <>
        <TableCell
          style={{
            textAlign: "center",
            right: "150px",
            boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
            minWidth: "60px",
          }}
          className={`${styles.table_actionColumn}`}
        >
          {event?.recruitmentAssociation ? (
            event?.recruitmentAssociation.length == 1 ? (
              event.recruitmentAssociation[0]
            ) : (
              <>
                {event.recruitmentAssociation[0]}&nbsp;
                <TooltipTrigger>
                  <Button className={styles["products-list"]}>
                    +{event.recruitmentAssociation.length - 1}
                  </Button>
                  <Tooltip>
                    {listProducts(event.recruitmentAssociation)}
                  </Tooltip>
                </TooltipTrigger>
              </>
            )
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell
          style={{
            textAlign: "center",
            right: "50px",
            minWidth: "100px",
          }}
          className={`${styles.table_actionColumn}`}
        >
          {event?.recruitmentAssociationPercentage == "High" ? (
            <span className={styles.badge_success}>High</span>
          ) : event?.recruitmentAssociationPercentage == "Medium" ? (
            <span className={styles.badge_primary}>Medium</span>
          ) : event?.recruitmentAssociationPercentage == "Low" ? (
            <span className={styles.badge_danger}>Low</span>
          ) : (
            "-"
          )}
        </TableCell>
      </>
    )} */}

    <TableCell>
      {event.advance?.maturity && event.advance?.maturity !== "" ? (
        <span style={{ textTransform: "capitalize" }} className="badge_primary">
          {event.advance?.maturity}
        </span>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell>
      {event.insights?.scores?.impactScore &&
      event.insights?.scores?.impactScore !== 0
        ? event.insights?.scores?.impactScore
        : "-"}
    </TableCell>

    <TableCell>
      {event.insights?.scores?.inboundScore &&
      event.insights?.scores?.inboundScore !== 0
        ? event.insights?.scores?.inboundScore
        : "-"}
    </TableCell>

    <TableCell>
      {event.insights?.scores?.internationalScore &&
      event.insights?.scores?.internationalScore !== 0
        ? event.insights?.scores?.internationalScore
        : "-"}
    </TableCell>

    <TableCell>
      {event.audience?.audienceZone && event.audience?.audienceZone !== "" ? (
        <span className={styles.badge_primary}>
          {event.audience?.audienceZone}
        </span>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell>
      <div style={{ display: "flex", gap: "8px" }}>
        {event.audience?.audienceSpread &&
        Object.entries(event.audience?.audienceSpread).length > 0
          ? Object.entries(event.audience?.audienceSpread).map(
              ([key, { iso, name, count, percentage }]) => (
                <span key={key} className={styles.country_badge} title={name}>
                  <Image
                    src={`https://img.10times.com/img/flag/${iso.toLowerCase()}.jpg`}
                    alt="flag"
                    width={25}
                    height={18}
                  />
                  {/* &nbsp;{Math.round(percentage * 10) / 10}% */}
                </span>
              )
            )
          : "-"}
      </div>
    </TableCell>

    <TableCell
      className={`${styles.table_actionColumn} ${styles.bookmarkColumn}`}
    >
      {/* <MenuTrigger
        onOpenChange={() =>
          handleModalOpen(
            event?.basic.id,
            event?.isSaved || bookmarkedEvent?.includes(event.basic.id) ? true : false
          )
        }
      >
        <Button className={styles.dropdown_button}>
          {path[path.length - 1] === "trackedEvents" ||
          path[path.length - 1] === "savedEvents" ||
          path[path.length - 1] === "trackers" ? (
            path[path.length - 1] === "trackedEvents" ? (
              <>
                {event?.isSaved ? (
                  <BookmarkFilled fillColor={"var(--primary-color)"} />
                ) : (
                  <BookmarkIcon className={"var(--secondary-text-color)"} />
                )}
              </>
            ) : (
              <BookmarkFilled fillColor={"var(--primary-color)"} />
            )
          ) : bookmarkedEvent?.includes(event.basic.id) ? (
            <BookmarkFilled fillColor={"var(--primary-color)"} />
          ) : (
            <BookmarkIcon fillColor={"var(--secondary-text-color)"} />
          )}
        </Button>
        <Popover className={styles.interestPopover} placement="left">
          <Dialog>
            <DialogContent>
              <div style={{ maxWidth: "500px" }}>
                <header className={styles["modal_header"]}>
                  <div className={styles["modal_header-title"]}>
                    Choose an{" "}
                    <Link
                      href="/internal/settings/product"
                      className="text-primary hover:underline"
                    >
                      Action
                    </Link>{" "}
                    to Proceed
                  </div>
                  <button className={styles["close"]} onClick={close}>
                    <Image src={closeIcon} alt="clock" width={16} height={16} />
                  </button>
                </header>
                <main className={styles["modal_content"]}>
                  <form onSubmit={(e) => handleSubmit(e, close)}>
                    <div id="field-1">
                      {source === "trackers" && (
                        <div className={styles["form-check"]}>
                          {path[path.length - 1] === "savedEvents" ||
                          path[path.length - 1] === "trackers" ||
                          event?.isSaved ||
                          bookmarkedEvent?.includes(event.basic.id) ? (
                            <>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="unbookmark"
                                name={"interest"}
                                id="customradio1"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio1">Un-Bookmark</label>
                            </>
                          ) : (
                            <>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="bookmark"
                                name={"interest"}
                                id="customradio1"
                                onChange={handleChangeIntent}
                                checked={
                                  formData.markedInterest === "bookmark" ||
                                  formData.markedInterest === null
                                }
                              />
                              <label htmlFor="customradio1">Bookmark</label>
                            </>
                          )}
                        </div>
                      )}
                      {coordinateActions.map((item: any, index: number) => (
                        <div className={styles["form-check"]} key={index}>
                          <input
                            className={styles["form-check-input"]}
                            type="radio"
                            defaultValue={item.status}
                            name={"interest"}
                            id={`radio-${item.status}`}
                            onChange={handleChangeIntent}
                          />
                          <label htmlFor={`radio-${item.status}`}>
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <button className={styles["submitBtn"]}>Submit</button>
                  </form>
                </main>
              </div>
            </DialogContent>
          </Dialog>
        </Popover>
      </MenuTrigger> */}
    </TableCell>
  </TableRow>
);
