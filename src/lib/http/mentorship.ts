import Cookies from "js-cookie"

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

export async function fetchMyMentorships(upcomingOnly?: boolean, recentOnly?: boolean) {
  try {
    let params;
    if (upcomingOnly) {
      params = `upcomingOnly=true`
    } else if (recentOnly) {
      params = `recentOnly=true`
    }

    const reqLink = `/api/mentorship/my-mentorships?${params}`
    const response = await fetch(reqLink, {
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

export async function bookMentorshipAppointment(mentorshipAppointmentId: string, hackerDescription: string) {
  try {
    const response = await fetch("/api/mentorship/mentorships", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-xsrf-token": Cookies.get("XSRF-TOKEN") || ""
      },
      body: JSON.stringify({
        mentorshipAppointmentId,
        hackerDescription
      })
    })
    const data = await response.json()
    if (!response.ok) {
      console.error("Error when booking a mentorship appointment. Please try again later.")
      return
    }
    console.log(data)
    return data
  } catch (error) {
    console.error("Error when trying to book a mentorship appointment:", error)
  }
}