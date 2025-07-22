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

/**
 * Get all available mentors
 */
export async function fetchAllMentors() {
  try {
    const response = await fetch("/api/mentorship/hacker/mentors", {
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

    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch all mentors:", error)
    return []
  }
}

export async function fetchMentorById(mentorId: string) {
  try {
    const response = await fetch(`/api/mentorship/hacker/mentors/${mentorId}`, {
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

    const reqLink = `/api/mentorship/hacker/my-mentorships?${params}`
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
    const response = await fetch(`/api/mentorship/hacker/mentorships/?mentorId=${mentorId}`, {
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
    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch mentorship appointments:", error)
  }
}

export async function bookMentorshipAppointment(payload: any) {
  try {
    const response = await fetch("/api/mentorship/hacker/mentorships/book", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-xsrf-token": Cookies.get("XSRF-TOKEN") || ""
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.error || "Booking limit reached. Please select fewer slots or try different slots.");
      }
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error when trying to book a mentorship appointment:", error);
    throw error;
  }
}

export async function cancelMentorshipAppointment(payload: any) {
  try {
    const response = await fetch("/api/mentorship/hacker/mentorships/cancel", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-xsrf-token": Cookies.get("XSRF-TOKEN") || ""
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error when trying to book a mentorship appointment:", error);
    throw error;
  }
}


/**
 * MENTOR ENDPOINTS
 */

export async function mentorFetchMyMentorships(limit?: number, upcomingOnly?: boolean, recentOnly?: boolean, isBooked?: boolean, isAvailable?: boolean) {
  try {
    let params = '?';
    if (limit) {
      params += `limit=${limit}`;
    }

    if (upcomingOnly) {
      params += `&upcomingOnly=true`
    } else if (recentOnly) {
      params += `&recentOnly=true`
    }

    if (isBooked) {
      params += `&isBooked=true`
    } else if (isAvailable) {
      params += `&isAvailable=true`
    }

    const reqLink = `/api/mentorship/mentor/my-mentorships${params}`
    const response = await fetch(reqLink, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error when fetching my mentorships for mentors...")
      return []
    }
    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch my mentorships for mentorships:", error)
    return []
  }
}

export async function mentorFetchMyMentorship(id: string) {
  try {
    const response = await fetch(`/api/mentorship/mentor/my-mentorships/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    if (!response.ok) {
      console.error("Error when trying to fetch mentorship appointments. Please try again later.")
      return 
    }
    return data.data
  } catch (error) {
    console.error("Something went wrong when trying to fetch mentorship appointments:", error)
    return
  }
}
