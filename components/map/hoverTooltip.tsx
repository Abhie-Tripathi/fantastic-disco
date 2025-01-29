interface HoverTooltipProps {
  hoverInfo: {
    x: number;
    y: number;
    feature: any;
    clusteredPoints?: { name: string; count: number }[];
  };
}

export default function hoverTooltip({ hoverInfo }: HoverTooltipProps) {
  return (
    <div
      className="absolute z-10 bg-white p-2 rounded shadow max-w-xs max-h-60 overflow-y-auto"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y - 10,
        transform: "translate(-50%, -100%)",
      }}
    >
      {hoverInfo.clusteredPoints ? (
        <>
          {hoverInfo.clusteredPoints
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((point, index) => (
              <div
                key={index}
                className="mb-1 flex justify-between items-center"
              >
                <span className="font-semibold">{point.name}</span>
                <span className="ml-2">{point.count}</span>
              </div>
            ))}
          {hoverInfo.clusteredPoints.length > 5 && (
            <div className="text-xs text-gray-500 italic mt-1">
              click to view more cities
            </div>
          )}
        </>
      ) : (
        <div className="mb-1 flex justify-between items-center">
          <span className="font-semibold">
            {hoverInfo.feature.properties.name}
          </span>
          <span className="ml-2">{hoverInfo.feature.properties.count}</span>
        </div>
      )}
    </div>
  );
} 