import React from "react";

const page = () => {
  return (
    <div className="p-6 pt-0">
      <div className="flex justify-between">
        <div>
          <div>
            <h3>Your Access</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Here's the access and permissions you have within your
              organisation
            </p>
          </div>
        </div>
        <div>Button</div>
      </div>
      <div className="mt-8">
        <div className="w-100 border">
          <div className="border-b">
            <div>first</div>
          </div>
          <div>second</div>
        </div>
      </div>
    </div>
  );
};

export default page;
