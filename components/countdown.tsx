"use client";

import { useEffect, useMemo, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

type Props = {
  date: string | Date;
};

export function Countdown({ date }: Props) {
  const target = useMemo(() => (date instanceof Date ? date : new Date(date)), [date]);
  const [label, setLabel] = useState(() => formatCountdown(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setLabel(formatCountdown(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return <span className="font-semibold text-bigjump.yellow">{label}</span>;
}

function formatCountdown(date: Date) {
  const now = new Date();
  if (date.getTime() <= now.getTime()) {
    return 'O grande dia chegou!';
  }

  const days = Math.max(0, differenceInDays(date, now));
  const hours = Math.max(0, differenceInHours(date, now) % 24);
  const minutes = Math.max(0, differenceInMinutes(date, now) % 60);
  const seconds = Math.max(0, differenceInSeconds(date, now) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
