import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PrescriptionData {
  image: string;
  medicineData: { name: string; dose: string; time: string }[];
  appointmentData: { name: string; time: string; location: string }[];
}

interface PrescriptionsState {
  prescriptionsData: PrescriptionData[];
  addPrescription: (data: PrescriptionData) => void;
}

export const usePrescriptionsStore = create<PrescriptionsState>()(
  devtools(
    persist(
      (set) => ({
        prescriptionsData: [],
        addPrescription: (data) =>
          set((state) => ({
            prescriptionsData: [...state.prescriptionsData, data],
          })),
      }),
      { name: "prescriptionStore" },
    ),
  ),
);
