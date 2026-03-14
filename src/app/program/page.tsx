import LogoutButton from "@/components/auth/LogoutButton";

export default function Page() {
  return (
    <>
      {/* title - collapsible nebo horizont arrows */}
      {/* na otevreni se ukazou links a user profile */}
      {/* nerozdelovat veci na instr a program, vyuzit conditional rendering podle role */}
      <header>
        <h1>Program</h1>
      </header>
      <main>
        <LogoutButton />
      </main>
    </>
  );
}
