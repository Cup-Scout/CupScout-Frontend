import { atom } from 'jotai';

interface cafeInfo {
  id: number;
  name: string;
  address_doro: string;
  address_jibun: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  categories: string | null;
  visible: number;
  deleted: number;
  created: string;
  updated: string;
  open_24h: number | null;
  operation: string;
}

interface openingHours {
  event: null;
  id: number;
  name: string;
  open_24h: number | null;
  opening_hours: {
    monday: { open: null | number; close: null | number };
    tuesday: { open: null | number; close: null | number };
    wednesday: { open: null | number; close: null | number };
    thursday: { open: null | number; close: null | number };
    friday: { open: null | number; close: null | number };
    saturday: { open: null | number; close: null | number };
    sunday: { open: null | number; close: null | number };
  };
}

const cafeListArr = atom<cafeInfo[]>([]);
export const getCafeListArr = atom(
  (get) => get(cafeListArr),
  (_, set, newState: cafeInfo[]) => {
    set(cafeListArr, newState);
  },
);

const selectedCategories = atom<Set<number>>(new Set<number>());
export const getSelectedCategories = atom(
  (get) => get(selectedCategories),
  (_, set, newState: any) => {
    set(selectedCategories, newState);
  },
);

const selectedCafe = atom<cafeInfo | null>(null);
export const getSelectedCafe = atom(
  (get) => get(selectedCafe),
  (_, set, newState: cafeInfo | null) => {
    set(selectedCafe, newState);
  },
);

const expandedId = atom<number | null>(null);
export const getExpandedId = atom(
  (get) => get(expandedId),
  (_, set, newState: number | null) => {
    set(expandedId, newState);
  },
);

const selectedCafeHour = atom<openingHours | null>(null);
export const getSelectedCafeHour = atom(
  (get) => get(selectedCafeHour),
  (_, set, newState: openingHours | null) => {
    set(selectedCafeHour, newState);
  },
);

const test = atom(false);
export const getTest = atom(
  (get) => get(test),
  (_, set, newsState: boolean | ((prev: boolean) => boolean)) => {
    set(test, newsState);
  },
);

const switchContent = atom(false);
export const getSwitchContent = atom(
  (get) => get(switchContent),
  (_, set, newState: boolean | ((prev: boolean) => boolean)) => {
    set(switchContent, newState);
  },
);

const todayHours = atom<{ open: string | null; close: string | null }>({
  open: null,
  close: null,
});
export const getTodayHours = atom(
  (get) => get(todayHours),
  (_, set, newState: { open: string | null; close: string | null }) => {
    set(todayHours, newState);
  },
);

const selectedExpandedId = atom<number | null>(null);
export const getSelectedExpandedId = atom(
  (get) => get(selectedExpandedId),
  (_, set, newState: number | null) => {
    set(selectedExpandedId, newState);
  },
);
