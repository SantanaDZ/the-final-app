'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (error.message.includes("Email not confirmed")) {
            redirect('/login?error=Por favor, confirme seu email clicando no link que enviamos.')
        }

        redirect('/login?error=Email ou senha incorretos')
    }

    revalidatePath('/', 'layout')
    redirect('/app')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // For name, we can store it in user metadata
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                name: formData.get('name') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/cadastro?error=Nao foi possivel criar a conta: ' + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/app')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
