export async function fetchMyMentorships() {
  try {
    const response = await fetch("/api/mentorship/my-mentorships", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error when fetching my mentorships...")
      return []
    }

    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch my mentorships", error)
  }
}