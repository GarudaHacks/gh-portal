import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { Ticket } from "./ticketService";

const TICKETS_COLLECTION = "tickets";

/**
 * Get all tickets for admin/mentor view
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const q = query(
      collection(db, TICKETS_COLLECTION),
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      submittedAt: doc.data().submittedAt,
    })) as Ticket[];
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    return [];
  }
};

/**
 * Get tickets by status
 */
export const getTicketsByStatus = async (
  status: Ticket["status"]
): Promise<Ticket[]> => {
  try {
    const q = query(
      collection(db, TICKETS_COLLECTION),
      where("status", "==", status),
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      submittedAt: doc.data().submittedAt,
    })) as Ticket[];
  } catch (error) {
    console.error(`Error fetching ${status} tickets:`, error);
    return [];
  }
};

/**
 * Claim a ticket (update status to 'claimed')
 */
export const claimTicket = async (
  ticketId: string,
  mentorId: string
): Promise<void> => {
  try {
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, {
      status: "claimed",
      mentorId,
      claimedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error claiming ticket:", error);
    throw new Error("Failed to claim ticket");
  }
};

/**
 * Resolve a ticket (update status to 'resolved')
 */
export const resolveTicket = async (ticketId: string): Promise<void> => {
  try {
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, {
      status: "resolved",
      resolvedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error resolving ticket:", error);
    throw new Error("Failed to resolve ticket");
  }
};

/**
 * Delete a ticket
 */
export const deleteTicket = async (ticketId: string): Promise<void> => {
  try {
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    await deleteDoc(ticketRef);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw new Error("Failed to delete ticket");
  }
};
