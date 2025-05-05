import { CheckCircle, CrossCircle } from "geist-icons";

interface Props {
  mappedHeaders: any;
  isSampleTable?: boolean;
}

const SampleTable = ({ mappedHeaders, isSampleTable }: Props) => {
  return (
    <div className="overflow-x-auto pb-1 min-h-32">
      <table className={`w-[100%] bg-[var(--primary-foreground)]`}>
        <thead>
          <tr>
            <th className="border border-collapse bg-[var(--accent-color)] p-2.5">
              {/* <CheckboxInput id={"abc"} onChange={handleChange} checked={false} /> */}
            </th>
            {mappedHeaders?.length > 0 &&
              mappedHeaders.map((entryKey: any) => (
                <th
                  className={`p-2.5 font-medium text-sm text-start border border-collapse ${
                    isSampleTable
                      ? "bg-[var(--accent-color)]"
                      : entryKey.isMatch
                      ? "bg-[var(--success-background-color)]"
                      : "bg-[var(--danger-background-color)]"
                  }`}
                  key={entryKey.defaultName}
                >
                  <div className="flex items-center gap-2">
                    {entryKey.defaultName}
                    {!isSampleTable &&
                      (entryKey.isMatch ? (
                        <CheckCircle
                          color="var(--positive-color)"
                          height="14px"
                        />
                      ) : (
                        <CrossCircle
                          color="var(--negative-color)"
                          height="14px"
                        />
                      ))}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2.5 text-sm text-start border border-collapse">
              <div className="h-5 w-5 border text-center">1</div>
            </td>
            {mappedHeaders.map((entryKey: any, index: number) => (
              <td
                className="p-2.5 font-medium text-sm text-start border border-collapse"
                key={index}
              ></td>
            ))}
          </tr>
          <tr>
            <td className="p-2.5 text-sm text-start border border-collapse">
              <div className="h-5 w-5 border text-center">2</div>
            </td>
            {mappedHeaders.map((entryKey: any, index: number) => (
              <td
                className="p-2.5 font-medium text-sm text-start border border-collapse"
                key={index}
              ></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SampleTable;
