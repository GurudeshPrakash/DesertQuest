const API_BASE_URL = "https://marcconrad.com/uob/heart/api.php";

export const fetchQuizData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
