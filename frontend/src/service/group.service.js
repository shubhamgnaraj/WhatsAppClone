
export const createAGroup = async (groupData) => {
    const response = await fetch("http://localhost:3000/api/create/group", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(groupData),
        credentials: 'include'
    })

    const data = await response.json();

    if (!response.ok) {
        throw Error("something went error in createA Group: ", data.message)
    }

    return data;
}