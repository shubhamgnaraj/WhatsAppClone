

export const getAdminUsers = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/admin/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        const data = await response.json();

        if (!response.ok) {
            throw Error(`Get admin users response is not okay: ${data.message}`)
        }

        return data


    } catch (error) {
        console.log("faild fetch to get admin users: ", error.message)
        throw error
    }
}

export const getTheMessagesSAndR = async (receiverId, userType) => {
    try {
        const response = await fetch(`http://localhost:3000/api/messages?receiverId=${receiverId}&chatType=${userType}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!response.ok) {
            const text = await response.text()
            throw Error(`Get admin messages response is not okay: ${response.status} ${response.statusText} - ${text}`)
        }

        const data = await response.json();

        return data
    } catch (error) {
        console.log("failed fetch to get admin messages: ", error.message)
        throw error
    }
}

export const addUserInTheAdminList = async(userdata) => {
    try {
        const response = await fetch("http://localhost:3000/api/add/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(userdata)
    })

    const data = await response.json();

    if(!response.ok) {
        throw Error("Add user response Not ok: ", data.message)
    }

    return data;
    } catch (error) {
        console.log("something went wrong inside the addUserInTheAdminList: ", error.message)
        throw error
    }
}

export const uploadFile = async (file) => {

    const formData = new FormData();

    formData.append('media', file)
    try {
        const response = await fetch("http://localhost:3000/api/upload/media", {
            method: "POST",
            body: formData,
            credentials: "include"
        })

        const data = await response.json();

        if (!response.ok) {
            throw Error(`Your media response not work: ${data.message}`)
        }

        return data
    } catch (error) {
        console.log('something went wrong in the uploadFile: ', error)
        throw error
    }
}