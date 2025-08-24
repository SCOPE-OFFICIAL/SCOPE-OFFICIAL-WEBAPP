import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage, deleteImage } from './storage-utils';

// FAQ type
export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order?: number;
  createdAt?: Date;
}

// Team type with image URL
export interface Team {
  id?: string;
  name: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  createdAt?: Date;
}

// Contact form submission type
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string;
  query: string;
  createdAt: Date;
}

// Get all FAQs from Firestore
export const getFAQs = async (): Promise<FAQ[]> => {
  try {
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as FAQ[];
  } catch (error) {
    console.error('Error getting FAQs:', error);
    // Return fallback data if Firebase fails
    return [
      {
        question: "What is SCOPE?",
        answer: "SCOPE is a club dedicated to fostering innovation and passion for electronics, embedded systems, and robotics. We focus on hands-on learning, projects, workshops, and technical discussions."
      },
      {
        question: "How can I join SCOPE?",
        answer: "You can join SCOPE by attending our introductory meetings and workshops, or by reaching out to our core team. We're always looking for enthusiastic members who want to learn and contribute."
      },
      {
        question: "What kind of projects do you work on?",
        answer: "Our projects range from basic circuit design and PCB development to advanced robotics, IoT systems, and software for embedded applications. We encourage members to bring their own ideas to life with our support."
      },
      {
        question: "Are there any prerequisites to join?",
        answer: "No prior experience is necessary. We welcome students from all backgrounds and skill levels. Our goal is to provide a supportive environment where you can learn from scratch."
      },
      {
        question: "How often does the club meet?",
        answer: "We typically have weekly meetings, workshops, and project sessions. Our schedule is flexible and is announced on our social media channels and our website's events page."
      }
    ];
  }
};

// Get all teams from Firestore
export const getTeams = async (): Promise<Team[]> => {
  try {
    const q = query(collection(db, 'teams'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Team[];
  } catch (error) {
    console.error('Error getting teams:', error);
    // Return fallback data if Firebase fails
    return [
      { 
        name: "Event Management", 
        imageUrl: "/images/teams/event-management.jpg",
        storagePath: "",
        order: 0
      },
      { 
        name: "Content and Design", 
        imageUrl: "/images/teams/content-design.jpg",
        storagePath: "",
        order: 1
      },
      { 
        name: "Student Coordinators", 
        imageUrl: "/images/teams/student-coordinators.jpg",
        storagePath: "",
        order: 2
      },
      { 
        name: "PR and Marketing", 
        imageUrl: "/images/teams/pr-marketing.jpg",
        storagePath: "",
        order: 3
      },
      { 
        name: "Technical", 
        imageUrl: "/images/teams/technical.jpg",
        storagePath: "",
        order: 4
      }
    ];
  }
};

// Submit contact form to Firestore
export const submitContactForm = async (data: Omit<ContactSubmission, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'contactSubmissions'), {
      ...data,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Failed to submit form');
  }
};

// Add a new team with image upload
export const addTeam = async (team: Omit<Team, 'id' | 'createdAt'>, imageFile: File): Promise<string> => {
  try {
    // Upload image to Firebase Storage
    const storagePath = `teams/${Date.now()}_${imageFile.name}`;
    const imageUrl = await uploadImage(imageFile, storagePath);
    
    // Add team data to Firestore
    const docRef = await addDoc(collection(db, 'teams'), {
      ...team,
      imageUrl,
      storagePath,
      order: team.order || 0,
      createdAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding team:', error);
    
    // Clean up uploaded image if Firestore operation failed
    if (team.storagePath) {
      try {
        await deleteImage(team.storagePath);
      } catch (deleteError) {
        console.error('Error cleaning up image:', deleteError);
      }
    }
    
    throw new Error('Failed to add team');
  }
};

// Update a team (with optional image update)
export const updateTeam = async (
  teamId: string, 
  updates: Partial<Omit<Team, 'id' | 'createdAt'>>, 
  newImageFile?: File
): Promise<void> => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const updateData: any = { ...updates };
    
    // If a new image is provided, upload it and update the URL
    if (newImageFile) {
      // First, upload the new image
      const storagePath = `teams/${Date.now()}_${newImageFile.name}`;
      const imageUrl = await uploadImage(newImageFile, storagePath);
      
      updateData.imageUrl = imageUrl;
      updateData.storagePath = storagePath;
      
      // Note: We're not deleting the old image here to avoid breaking existing references
    }
    
    await updateDoc(teamRef, updateData);
  } catch (error) {
    console.error('Error updating team:', error);
    throw new Error('Failed to update team');
  }
};

// Delete a team and its image
export const deleteTeam = async (teamId: string, storagePath: string): Promise<void> => {
  try {
    // Delete the team document from Firestore
    const teamRef = doc(db, 'teams', teamId);
    await deleteDoc(teamRef);
    
    // Delete the associated image from Storage
    if (storagePath) {
      await deleteImage(storagePath);
    }
  } catch (error) {
    console.error('Error deleting team:', error);
    throw new Error('Failed to delete team');
  }
};

// Get all contact submissions (for admin purposes)
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as ContactSubmission[];
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    return [];
  }
};