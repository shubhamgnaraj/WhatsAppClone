import { getDataAPI } from "../../utility/fetchRequest";

export const sendToServerStatusData = async ({ attemptId, statusDescription, file }) => {

    const formData = new FormData();

    formData.append("mediaData", file)
    formData.append("statusDescription", statusDescription || "")
    formData.append("attemptId", attemptId)

    const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/admin/status`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw Error(`Your media response not work: ${data.message}`)
    }

    if (!data) {
        console.log(true)
    } else {
        console.log(false)
        return data
    }
}

export const getUsersWtihStatus = async () => {

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/admin/status`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw Error(`Admin not fetch Statuses: ${data.message}`)
        }

        return data;
    } catch (error) {
        console.log(`Admin not fetches statuses: ${error.message}`)
        throw error
    }
}

export const getValidUserStatus = async (userId) => {
    const result = await getDataAPI(`user/status/${userId}`, 'This user status not found', {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    });

    return result;
}