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

export type MyTableStatus = "found" | "unassigned" | "no-formation" | "error"

export interface MyTableResult {
  status: MyTableStatus
  formationId?: string
  location?: string
  tableNumber?: number
  message?: string
}

/**
 * Fetch the table assignment for the logged in user.
 *
 * Maps the backend's three responses to a discriminated `status`:
 * - `found`: seated at a table (has `location` + `tableNumber`)
 * - `unassigned`: part of a formation, but no table yet (has `message`)
 * - `no-formation`: user isn't part of any formation (404)
 * - `error`: request failed
 */
export async function fetchMyTable(): Promise<MyTableResult> {
  try {
    const response = await fetch("/api/users/find-my-tables", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json().catch(() => ({}))

    if (response.status === 404) {
      return { status: "no-formation", message: data?.error }
    }

    if (!response.ok) {
      console.error("Error when fetching my table:", response.status)
      return { status: "error", message: data?.error }
    }

    // 200: formation exists but no table assigned yet.
    if (typeof data?.message === "string") {
      return {
        status: "unassigned",
        formationId: data.formationId,
        message: data.message,
      }
    }

    return {
      status: "found",
      formationId: data?.formationId,
      location: String(data?.location ?? ""),
      tableNumber: Number(data?.tableNumber) || 0,
    }
  } catch (error) {
    console.error("Something went wrong trying to fetch my table:", error)
    return { status: "error", message: "Something went wrong. Please try again later." }
  }
}