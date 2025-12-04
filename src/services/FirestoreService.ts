import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TimerCombination } from '../core/models/TimerCombination';

const TIMERS_COLLECTION = 'timers';

/**
 * FirestoreService - Handles all Firestore operations for timers
 */
export class FirestoreService {
    /**
     * Get all timers for a user
     */
    static async getUserTimers(userId: string): Promise<TimerCombination[]> {
        try {
            const timersRef = collection(db, TIMERS_COLLECTION);
            const q = query(timersRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            const timers: TimerCombination[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                timers.push({
                    ...data,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    updatedAt: data.updatedAt?.toDate?.() || new Date(),
                } as TimerCombination);
            });

            return timers;
        } catch (error) {
            console.error('Error getting timers:', error);
            return [];
        }
    }

    /**
     * Get a single timer by ID
     */
    static async getTimer(timerId: string): Promise<TimerCombination | null> {
        try {
            const timerRef = doc(db, TIMERS_COLLECTION, timerId);
            const timerDoc = await getDoc(timerRef);

            if (timerDoc.exists()) {
                const data = timerDoc.data();
                return {
                    ...data,
                    id: timerDoc.id,
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    updatedAt: data.updatedAt?.toDate?.() || new Date(),
                } as TimerCombination;
            }

            return null;
        } catch (error) {
            console.error('Error getting timer:', error);
            return null;
        }
    }

    /**
     * Create a new timer
     */
    static async createTimer(
        userId: string,
        timer: Omit<TimerCombination, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<string> {
        try {
            const timerRef = doc(collection(db, TIMERS_COLLECTION));
            const timerData = {
                ...timer,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(timerRef, timerData);
            return timerRef.id;
        } catch (error) {
            console.error('Error creating timer:', error);
            throw error;
        }
    }

    /**
     * Update an existing timer
     */
    static async updateTimer(
        timerId: string,
        updates: Partial<TimerCombination>
    ): Promise<void> {
        try {
            const timerRef = doc(db, TIMERS_COLLECTION, timerId);
            await updateDoc(timerRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating timer:', error);
            throw error;
        }
    }

    /**
     * Delete a timer
     */
    static async deleteTimer(timerId: string): Promise<void> {
        try {
            const timerRef = doc(db, TIMERS_COLLECTION, timerId);
            await deleteDoc(timerRef);
        } catch (error) {
            console.error('Error deleting timer:', error);
            throw error;
        }
    }
}
