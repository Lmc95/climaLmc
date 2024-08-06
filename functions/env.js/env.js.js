export const handler = async (event) => {
  try {
    const apiKey = process.env.APIKEY;  // Obtener la variable de entorno
    if (!apiKey) {
      throw new Error("API Key no definida.");
    }
    return {
      statusCode: 200,
      body: apiKey,  // Devolver la API Key
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

