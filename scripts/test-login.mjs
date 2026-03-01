const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
    console.error("Missing SUPABASE URL or ANON KEY in .env file.");
    process.exit(1);
}

async function testLogin() {
    console.log("Tentando logar via API HTTP...");

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
        },
        body: JSON.stringify({
            email: "admin@equilibra.app",
            password: "l64c72j99A03.",
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Erro ao fazer login:", data.error_description || data.msg || JSON.stringify(data));
    } else {
        console.log("Login feito com sucesso! Token:", !!data.access_token);
    }
}

testLogin();
