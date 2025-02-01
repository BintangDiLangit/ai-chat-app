const config = {
  env: {
    ollama: {
      ollamaApiKey: process.env.OLLAMA_API_KEY,
      ollamaEndpoint: process.env.OLLAMA_ENDPOINT,
    },
  },
};

export default config;
