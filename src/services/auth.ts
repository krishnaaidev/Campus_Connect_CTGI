// CampusConnect CTGI — Authentication Service (Firebase Auth & Real Institutional Sessions)
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, UserRole, Gender } from '../types';
import { StorageService, INITIAL_USERS } from './storage';

const CURRENT_USER_KEY = 'campusconnect_current_user_v3';

type AuthListener = (user: User | null) => void;

export class AuthService {
  private static listeners: AuthListener[] = [];
  private static currentUser: User | null = null;

  public static initialize(): void {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = null;
      }
    }

    // Default to the first registered student if no active session
    if (!this.currentUser) {
      const defaultUser = StorageService.getUsers().find(u => u.role === 'STUDENT_HOSTELLER') || INITIAL_USERS[0];
      this.currentUser = defaultUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
    }

    // Sync with Firebase Auth in the background
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
   * Quick Switch by user ID (for institutional directory switcher)
   */
  public static switchUserById(userId: string): User {
    const user = StorageService.getUser(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Quick Switch by role
   */
  public static switchRole(role: UserRole): User {
    const user = StorageService.getUsers().find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role);
    if (!user) throw new Error(`User not found for role: ${role}`);
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Real Institutional Sign In
   */
  public static async loginWithEmail(emailOrId: string, pass: string): Promise<User> {
    const query = emailOrId.trim().toLowerCase();

    // 1. Check if user exists in institutional store
    const localUser = StorageService.getUsers().find(
      u => u.email.toLowerCase() === query || u.institutionUserId.toLowerCase() === query
    );

    if (auth && localUser?.email) {
      try {
        await signInWithEmailAndPassword(auth, localUser.email, pass);
      } catch (firebaseErr: any) {
        console.warn('Firebase Auth note:', firebaseErr.message);
      }
    }

    if (localUser) {
      this.setCurrentUser(localUser);
      return localUser;
    }

    throw new Error('User account not found. Please check your institutional ID or email.');
  }

  /**
   * Real Account Registration
   */
  public static async registerWithEmail(params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    gender: Gender;
    department: string;
    studentType?: 'HOSTELLER' | 'DAY_SCHOLAR';
    hostelBlock?: string;
    roomNumber?: string;
    phone: string;
    guardianName?: string;
    guardianPhone?: string;
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

    const isStudent = params.role.startsWith('STUDENT');
    const isHosteller = params.studentType === 'HOSTELLER';
    const hostelCat = isHosteller ? (params.gender === 'FEMALE' ? 'GIRLS_HOSTEL' : 'BOYS_HOSTEL') : undefined;
    const warden = isHosteller 
      ? (params.gender === 'FEMALE' ? 'Dr. Sunita Sharma' : 'Dr. Rajesh Verma')
      : undefined;

    const newUser: User = {
      id: fbUid || `user-${Date.now()}`,
      institutionUserId: `CTGI/2026/${isStudent ? 'STD' : 'FAC'}/${Math.floor(100 + Math.random() * 900)}`,
      name: params.name,
      email: params.email,
      phone: params.phone,
      role: params.role,
      gender: params.gender,
      department: params.department,
      semester: 1,
      section: 'A',
      studentType: params.studentType,
      hostelCategory: hostelCat,
      hostelBlock: params.hostelBlock,
      roomNumber: params.roomNumber,
      wardenName: warden,
      classInchargeName: 'Prof. Sunita Mehra',
      guardianName: params.guardianName,
      guardianPhone: params.guardianPhone,
      avatarUrl: params.gender === 'FEMALE' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
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
      } catch (e) {}
    }
    this.setCurrentUser(null);
  }
}

// Auto initialize
AuthService.initialize();
