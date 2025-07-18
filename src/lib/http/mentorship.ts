export async function fetchMentorshipConfig() {
  try {
    const response = await fetch("/api/mentorship/config", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    if (!response.ok) {
      console.error("Error when fetching mentorship config. Please try again later.")
    }

    return data.data
  } catch (error) {
    console.error("Something went wrong trying to fetch mentorship config")
  }
}

export async function fetchAllMentors() {
  try {
    const response = await fetch("/api/mentorship/mentors", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error when fetching all mentors. Please try again later.")
      return []
    }

    return data.allMentors
  } catch (error) {
    console.error("Something went wrong when trying to fetch all mentors:", error)
    return []
  }
}

export async function fetchMentorById(mentorId: string) {
  try {
    const response = await fetch(`/api/mentorship/mentors/${mentorId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    if (!response.ok) {
      console.error("Error when trying to fetch mentor details...")
      return
    }

    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch mentor detail:", error)
  }
}

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
    console.error("Something went wrong when trying to fetch my mentorships:", error)
    return []
  }
}

export async function fetchMentorshipAppointmentsByMentorId(mentorId: string) {
  try {
    const response = await fetch(`/api/mentorship/mentorships/${mentorId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    if (!response.ok) {
      console.error("Error when trying to fetch mentorship appointments. Please try again later.")
      return []
    }
    return data
  } catch (error) {
    console.error("Something went wrong when trying to fetch mentorship appointments:", error)
  }
}