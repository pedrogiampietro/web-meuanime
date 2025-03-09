import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";

export function Auth() {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google", "github"]}
        theme="dark"
        showLinks={true}
        view="sign_in"
        redirectTo={window.location.origin}
      />
    </div>
  );
}
