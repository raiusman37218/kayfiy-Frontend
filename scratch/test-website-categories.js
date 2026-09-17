const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lavembmsofbxilinjlik.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzg4NDIsImV4cCI6MjEwMzU1NDg0Mn0.dXIdv7LVeZy77JT56g6dfT7ksTtrZj9Qwiab9PLvvyw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWebsiteCategories() {
  const { data: cats, error } = await supabase
    .from("catalog_categories")
    .select("*")
    .eq("status", "Active")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Active categories visible on website:", cats.length);
  const topLevel = cats.filter(c => !c.parent_slug && c.show_in_header !== false);
  console.log("Header Main Items:", topLevel.map(c => c.name));

  for (const parent of topLevel) {
    const children = cats.filter(c => c.parent_slug === parent.slug && c.show_in_header !== false);
    console.log(`- ${parent.name} has ${children.length} subcategories:`, children.map(c => c.name));
  }
}

testWebsiteCategories();
