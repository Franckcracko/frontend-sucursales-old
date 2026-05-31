import { create } from 'zustand'

interface BranchState {
  branch: string
  setBranch: (branch: string) => void
}

export const useBranchSelected = create<BranchState>()((set) => ({
  branch: 'COLONIAS',
  setBranch: (branch) => set({ branch }),
}))
