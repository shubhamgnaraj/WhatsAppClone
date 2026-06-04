

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

export const getTheMessagesSAndR = async (reciverId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/messages/${reciverId}`, {
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