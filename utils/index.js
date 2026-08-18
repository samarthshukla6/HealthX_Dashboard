export const isPublicKeyMissingError = ({ vapiError, error } = {}) => {
    const message = vapiError?.message || error?.message || "";
    return /missing|not configured|api key|speech engine|gemini/i.test(message);
  };
  