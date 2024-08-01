import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";

export const saveTracker = async (filterData: any) => {

    if(filterData.trackerName === undefined || filterData.trackerName == '' || filterData.filters === undefined || Object.keys(filterData.filters).length == 0){
        console.log('Error!');return;
    }

    const formData = {
        name: filterData.trackerName,
        filterValue: filterData.filters,
    }
    console.log(filterData, formData);

    const { data, error } = await myFetch(`${baseUrl}/tracker`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (error) {
        console.log(error);
        return;
    }

    if (data) {
        console.log(data);
        return data.id;
    }

};