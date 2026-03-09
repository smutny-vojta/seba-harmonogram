interface LoginPhase2Props {
  phoneNumber: string;
}

export default function LoginPhase2({ phoneNumber }: LoginPhase2Props) {
  return <div>Login Phase 2 {phoneNumber}</div>;
}
