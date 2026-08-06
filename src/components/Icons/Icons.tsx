import type { ReactNode } from 'react';

interface IconProps {
  children: ReactNode;
  size?: number;
  className?: string;
}

function Icon({ children, size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function LocationIcon() {
  return (
    <Icon>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function CalendarIcon() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </Icon>
  );
}

export function UsersIcon() {
  return (
    <Icon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function UserIcon() {
  return (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

export function ClockIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function ChevronDownIcon() {
  return (
    <Icon size={16}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <Icon size={28}>
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </Icon>
  );
}

export function ArrowRightIcon() {
  return (
    <Icon>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon size={22}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Icon>
  );
}

export function PassengerIcon() {
  return (
    <Icon size={18}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2M17 11a4 4 0 0 1 4 4v4" />
    </Icon>
  );
}

export function LuggageIcon() {
  return (
    <Icon size={18}>
      <rect x="5" y="7" width="14" height="13" rx="2" />
      <path d="M9 7V4h6v3M9 11v5M15 11v5" />
    </Icon>
  );
}

export function CheckIcon() {
  return (
    <Icon>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  );
}

export function ShieldIcon() {
  return (
    <Icon>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.1 8.5 7.5 9.5 4.4-1 7.5-5 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function CardIcon() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </Icon>
  );
}

export function LockIcon() {
  return (
    <Icon>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Icon>
  );
}
