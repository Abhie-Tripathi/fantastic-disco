import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GeneralSection } from "@/app/(pages)/widget/setting/notifications/page";

interface GeneralNotification {
  generalNotification: GeneralSection;
  handleGeneralCheckboxChange: (
    sectionId: string,
    optionId: string,
    type: "inProduct" | "email"
  ) => void;
}

export function GeneralNotifications({
  generalNotification,
  handleGeneralCheckboxChange,
}: GeneralNotification) {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold text-gray-900">
          {generalNotification.title}
        </h1>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div></div>
          {/* <div className="flex items-center justify-center space-x-2">
            <Checkbox
              id="inProductAll"
              checked={generalNotification.inProduct.all}
              onCheckedChange={() =>
                handleGeneralCheckboxChange("inProduct", "all")
              }
            />
            <Label htmlFor="inProductAll">In Product</Label>
          </div> */}
          {/* <div className="flex items-center justify-center space-x-2">
            <Checkbox
              id="emailAll"
              checked={generalNotifications.email.all}
              onCheckedChange={() =>
                handleGeneralCheckboxChange("email", "all")
              }
            />
            <Label htmlFor="emailAll">Email</Label>
          </div> */}
        </div>
        {generalNotification.options.map((option) => (
          <div key={option.id} className="grid grid-cols-3 items-center mt-4">
            <div>{option.description}</div>
            <div className="flex justify-center">
              <Checkbox
                checked={option.inProduct}
                onCheckedChange={() => 
                  handleGeneralCheckboxChange(generalNotification.id, option.id, "inProduct")
                }
              />
            </div>
            <div className="flex justify-center">
              <Checkbox
                checked={option.email}
                onCheckedChange={() => 
                  handleGeneralCheckboxChange(generalNotification.id, option.id, "email")
                }
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
