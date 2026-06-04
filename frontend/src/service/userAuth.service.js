
export const registerUserService = async (userData) => {
    try {
        const response = await fetch("http://localhost:3000/register/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: "include"
        })

        const data = await response.json();

        if (!response.ok) {
            throw Error('your resonse is not ok', data.message)
        }

        console.log('data: ', data)
        return data;

    } catch (error) {
        console.log('Fetch faild: ', error.message)
        throw error
    }
}

export const loginUserService = async (userData) => {
    try {
        const response = await fetch("http://localhost:3000/login/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: "include"
        })

        const data = await response.json();

        if (!response.ok) {
            throw Error('your resonse is not ok', data.message)
        }
        return data;

    } catch (error) {
        console.log('Fetch faild: ', error.message)
        throw error
    }
}