import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  try {
    const { data, error } = await supabase
      .from("tourist_sites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching sites:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sites" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});