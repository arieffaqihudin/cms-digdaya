import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SeedUser {
  email: string;
  password: string;
  role: "super_admin" | "editor" | "viewer";
  display_name: string;
}

const defaultUsers: SeedUser[] = [
  {
    email: "admin@digdaya.nu.id",
    password: "Admin123!",
    role: "super_admin",
    display_name: "Super Admin",
  },
  {
    email: "editor@digdaya.nu.id",
    password: "Editor123!",
    role: "editor",
    display_name: "Editor",
  },
  {
    email: "viewer@digdaya.nu.id",
    password: "Viewer123!",
    role: "viewer",
    display_name: "Viewer",
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: { email: string; status: string; role: string }[] = [];

    for (const user of defaultUsers) {
      // Check if user already exists
      const { data: existingUsers } =
        await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (u) => u.email === user.email
      );

      if (existing) {
        // Ensure role is correct
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", existing.id)
          .single();

        if (!existingRole) {
          await supabaseAdmin.from("user_roles").upsert(
            { user_id: existing.id, role: user.role },
            { onConflict: "user_id,role" }
          );
        } else if (existingRole.role !== user.role) {
          // Update to correct role
          await supabaseAdmin
            .from("user_roles")
            .update({ role: user.role })
            .eq("user_id", existing.id);
        }

        results.push({
          email: user.email,
          status: "already_exists",
          role: user.role,
        });
        continue;
      }

      // Create user
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { display_name: user.display_name },
        });

      if (createError) {
        results.push({
          email: user.email,
          status: `error: ${createError.message}`,
          role: user.role,
        });
        continue;
      }

      if (newUser?.user) {
        // The trigger auto-assigns 'viewer', so update if different
        if (user.role !== "viewer") {
          await supabaseAdmin
            .from("user_roles")
            .update({ role: user.role })
            .eq("user_id", newUser.user.id);
        }

        results.push({
          email: user.email,
          status: "created",
          role: user.role,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
