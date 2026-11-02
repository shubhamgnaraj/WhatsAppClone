import AppError from "../utility/AppError.utility"

export const validateMessage = async (data) => {

    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return {
            success: false,
            errors: ["Invalid message payload"],
        };
    }

    const { reciverId, content, chatType, parrentMsgId } = data;

    if (typeof reciverId !== "string" || !/^[a-fA-F0-9]{24}$/.test(reciverId)) {
        errors.push("Valid receiverId is Required!")
    }

    if (typeof content !== "string" || content.trim().length === 0) {
        errors.push("Message text is Required")
    } else if (content.trim().length >= 4000) {
        errors.push("Message cannot exceed 4000 characters");
    }

    if (errors.length > 0) {
        return {
            success: false,
            errors
        }
    }

    return {
        success: true,
        receiverId: reciverId,
        content: content.trim(),
        chatType,
        parrentMsgId
    }
}