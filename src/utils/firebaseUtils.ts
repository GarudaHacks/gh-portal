import { getDownloadURL, ref } from "@firebase/storage"
import { storage } from "./firebase"

/**
 * Fetch mentor image
 */
export async function getMentorProfilePicture(mentor_name: string) {
  try{
    const imageRef = ref(storage, `/mentors/${mentor_name}.png`)
    const url = await getDownloadURL(imageRef)
    return url
  } catch (error) {
    return ''
  }
}