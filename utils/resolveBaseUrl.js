const resolveBaseUrl = () => {
    if (process.env.SERVER_URL) {
      return process.env.SERVER_URL;
    }
    const port = process.env.PORT || 5001;
    return `http://localhost:${port}`;
};