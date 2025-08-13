"use client";
import Button from "@/src/components/ui/button";
import http from "@/src/lib/http/axios";

export default function Home() {
  const ping = async () => {
    try {
      const { data } = await http.get("/users/me");
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      alert("Not logged in (or token invalid)");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Welcome 👋</h1>
      <Button onClick={ping}>Ping /users/me</Button>
    </div>
  );
}
