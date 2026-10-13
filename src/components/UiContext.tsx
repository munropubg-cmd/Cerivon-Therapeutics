import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Ui = {
  goalsOpen: boolean;
  bmiOpen: boolean;
  openGoals: () => void;
  closeGoals: () => void;
  openBmi: () => void;
  closeBmi: () => void;
};

const Ctx = createContext<Ui | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [goalsOpen, setGoals] = useState(false);
  const [bmiOpen, setBmi] = useState(false);
  const openGoals = useCallback(() => setGoals(true), []);
  const closeGoals = useCallback(() => setGoals(false), []);
  const openBmi = useCallback(() => setBmi(true), []);
  const closeBmi = useCallback(() => setBmi(false), []);
  const value = useMemo(
    () => ({ goalsOpen, bmiOpen, openGoals, closeGoals, openBmi, closeBmi }),
    [goalsOpen, bmiOpen, openGoals, closeGoals, openBmi, closeBmi],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useUi = () => {
  const ui = useContext(Ctx);
  if (!ui) throw new Error('useUi must be used inside <UiProvider>');
  return ui;
};
