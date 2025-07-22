export async function fetchMyRole() {
  try {
    const response = await fetch("/api/auth/role", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error when fetching my role")
      return 'hacker'
    }

    return data.role
  } catch (error) {
    console.error("Something went wrong when trying to fetch all mentors:", error)
    return 'hacker'
  }
}