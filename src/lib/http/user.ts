export async function fetchMyBoardingPass() {
  try {
    const response = await fetch("/api/users/boarding-pass", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      console.error("Error when fetching user boarding pass:", response.status)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error("Something went wrong trying to fetch my boarding pass:", error)
    return null
  }
}