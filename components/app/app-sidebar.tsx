import { createClient } from "@/utils/supabase/server"
import { AppSidebarClient } from "./app-sidebar-client"

export async function AppSidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <AppSidebarClient user={user} />
}
