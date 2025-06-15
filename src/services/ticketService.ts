import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { QuestionFormData } from "../components/QuestionForm";
import { User } from "firebase/auth";

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  location: string;
  status: "waiting" | "claimed" | "resolved";
  submittedAt: string;
  categories: string[];
  userId: string;
  userEmail?: string;
}

const TICKETS_COLLECTION = "tickets";

/**
 * Submit a new ticket to Firestore
 */
export const submitTicket = async (
  formData: QuestionFormData,
  user: User | null
): Promise<Ticket> => {
  const ticketData: Omit<Ticket, "id"> = {
    subject: formData.subject,
    description: formData.description,
    location: formData.location,
    status: "waiting",
    submittedAt: new Date().toISOString(),
    categories: formData.categories,
    userId: user?.uid || "anonymous",
    userEmail: user?.email || undefined,
  };

  try {
    const docRef = await addDoc(collection(db, TICKETS_COLLECTION), ticketData);
    return {
      ...ticketData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error submitting ticket:", error);
    throw new Error("Failed to submit ticket");
  }
};

/**
 * Get all tickets for a specific user
 */
export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  try {
    const q = query(
      collection(db, TICKETS_COLLECTION),
      where("userId", "==", userId),
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      submittedAt: doc.data().submittedAt,
    })) as Ticket[];
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return [];
  }
};

/**
 * Update a ticket's status
 */
export const updateTicketStatus = async (
  ticketId: string,
  status: Ticket["status"]
): Promise<void> => {
  try {
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, { status });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw new Error("Failed to update ticket status");
  }
};
