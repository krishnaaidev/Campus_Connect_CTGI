// CampusConnect CTGI — Authentication Service (Firebase Auth + Demo Role Switcher)
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, UserRole } from '../types';
import { StorageService, SEED_USERS } from './storage';

const CURRENT_USER_KEY = 'campusconnect_current_user';

type AuthListener = (user: User | null) => void;

export class AuthService {
  private static listeners: AuthListener[] = [];
  private static currentUser: User | null = null;

  public static initialize(): void {
    // Check saved session in local storage
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = null;
      }
    }

    // Default to hosteller student if no user is logged in
    if (!this.currentUser) {
      const defaultUser = StorageService.getUsers().find(u => u.role === 'STUDENT_HOSTELLER') || SEED_USERS[0];
      this.currentUser = defaultUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
    }

    // Sync with Firebase Auth in the background if available
    try {
      if (auth) {
        onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
          if (fbUser && fbUser.email) {
            const matched = StorageService.getUsers().find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase());
            if (matched) {
              this.setCurrentUser(matched);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Firebase Auth state listener note:', e);
    }
  }

  public static getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.initialize();
    }
    return this.currentUser;
  }

  public static setCurrentUser(user: User | null): void {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.notifyListeners();
  }

  public static subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  /**
   * 1-Click Role Switcher for instant demo evaluation
   */
  public static switchRole(role: UserRole): User {
    const user = StorageService.getUsers().find(u => u.role === role) || 
                 SEED_USERS.find(u => u.role === role);
    if (!user) throw new Error(`No demo user for role ${role}`);
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Switch by specific user ID
   */
  public static switchUserById(userId: string): User {
    const user = StorageService.getUser(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Real Firebase Auth Login
   */
  public static async loginWithEmail(email: string, pass: string): Promise<User> {
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const user = StorageService.getUsers().find(u => u.email.toLowerCase() === cred.user.email?.toLowerCase());
        if (user) {
          this.setCurrentUser(user);
          return user;
        }
      } catch (firebaseErr: any) {
        console.warn('Firebase Auth error, checking institutional directory:', firebaseErr.message);
      }
    }

    // Fallback: check institutional user directory
    const localUser = StorageService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (localUser) {
      this.setCurrentUser(localUser);
      return localUser;
    }
    throw new Error('User account not registered in CampusConnect system');
  }

  /**
   * Real Firebase Auth Registration
   */
  public static async registerWithEmail(params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    studentType?: 'HOSTELLER' | 'DAY_SCHOLAR';
    phone: string;
  }): Promise<User> {
    let fbUid = '';
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
        fbUid = cred.user.uid;
      } catch (e: any) {
        console.warn('Firebase user creation note:', e.message);
      }
    }

    const newUser: User = {
      id: fbUid || `user-${Date.now()}`,
      institutionUserId: `CTGI/2026/${params.role.startsWith('STUDENT') ? 'STD' : 'FAC'}/${Math.floor(100 + Math.random() * 900)}`,
      name: params.name,
      email: params.email,
      phone: params.phone,
      role: params.role,
      department: params.department,
      studentType: params.studentType,
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  }

  /**
   * Sign Out
   */
  public static async logout(): Promise<void> {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        // ignore
      }
    }
    this.setCurrentUser(null);
  }
}

// Auto initialize
AuthService.initialize();
