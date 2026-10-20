/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_COLLEGE_NAME: string;
  readonly VITE_CAMPUS_NAME: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_WORKING_HOURS_START: string;
  readonly VITE_WORKING_HOURS_END: string;
  readonly VITE_DAY_SCHOLAR_PASS_DEADLINE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
