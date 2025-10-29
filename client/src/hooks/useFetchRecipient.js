import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      // ✅ Safely handle when user doesn't exist or response is null
      if (!response || response.error) {
        setError(response?.error || "User not found or deleted");
        setRecipientUser(null);
        return;
      }

      setRecipientUser(response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};
