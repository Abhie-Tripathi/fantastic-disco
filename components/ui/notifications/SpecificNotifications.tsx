"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpecificSection } from "@/app/(pages)/widget/setting/notifications/page";

const EMAIL_FREQUENCY_OPTIONS = [
  { value: "immediate", label: "Immediate" },
  { value: "1hour", label: "1 hour" },
  { value: "8hours", label: "8 hours" },
  { value: "24hours", label: "24 hours" },
] as const;

interface SpecificNotifications {
  specificNotifications: SpecificSection;
  handleSpecificCheckboxChange: (
    sectionId: string,
    optionId: string,
    subOptionId: string | null,
    type: "inProduct" | "email"
  ) => void;
}

export function SpecificNotifications({
  specificNotifications,
  handleSpecificCheckboxChange,
}: SpecificNotifications) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold text-gray-900">
          {specificNotifications.title}
        </h1>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div></div>
          <div className="flex items-center justify-center space-x-2">
            <Checkbox
              id="specificInProductAll"
              checked={specificNotifications.inProduct}
              onCheckedChange={() =>
                handleSpecificCheckboxChange(specificNotifications.id, "", null, "inProduct")
              }
            />
            <Label htmlFor="specificInProductAll">In Product</Label>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Checkbox
              id="specificEmailAll"
              checked={specificNotifications.email}
              onCheckedChange={() =>
                handleSpecificCheckboxChange(specificNotifications.id, "", null, "email")
              }
            />
            <Label htmlFor="specificEmailAll">Email</Label>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {specificNotifications.options.map((option) => (
            <AccordionItem
              value={option.title}
              key={option.title}
            >
              <AccordionTrigger iconPosition="start">
                <div className="grid grid-cols-3 items-center w-full">
                  <div className="text-left">{option.title}</div>
                  <div className="text-center">
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={option.inProduct}
                      onCheckedChange={() =>
                        handleSpecificCheckboxChange(
                          specificNotifications.id,
                          option.id,
                          null,
                          "inProduct"
                        )
                      }
                    />
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={option.email}
                      onCheckedChange={() =>
                        handleSpecificCheckboxChange(
                          specificNotifications.id,
                          option.id,
                          null,
                          "email"
                        )
                      }
                    />
                    <Select defaultValue="8hours">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EMAIL_FREQUENCY_OPTIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {option.subOptions.map((subOption) => (
                    <div
                      key={subOption.id}
                      className="ml-6 grid grid-cols-3 items-center"
                    >
                      <div>{subOption.description}</div>
                      <div className="text-center">
                        <Checkbox
                          checked={subOption.inProduct}
                          onCheckedChange={() =>
                            handleSpecificCheckboxChange(
                              specificNotifications.id,
                              option.id,
                              subOption.id,
                              "inProduct"
                            )
                          }
                        />
                      </div>
                      <div className="text-center">
                        <Checkbox
                          checked={subOption.email}
                          onCheckedChange={() =>
                            handleSpecificCheckboxChange(
                              specificNotifications.id,
                              option.id,
                              subOption.id,
                              "email"
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
