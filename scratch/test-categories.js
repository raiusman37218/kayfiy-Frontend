async function run() {
  const loginRes = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "owner@admin.local", password: "Admin2026" }),
  });
  const cookie = loginRes.headers.get("set-cookie");
  console.log("Login ok:", loginRes.ok);

  const catsRes = await fetch("http://localhost:3000/api/admin/categories", {
    method: "POST",
    headers: { "Cookie": cookie, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const catsData = await catsRes.json();
  console.log("Total categories in Admin:", catsData.categories?.length);
  for (const c of catsData.categories || []) {
    console.log(
      `[${c.status}] ${c.name} (${c.slug}) -> Parent: ${c.parentSlug || "None"} | Sort: ${c.sortOrder} | InHeader: ${c.showInHeader}`
    );
  }
}

run().catch(console.error);
