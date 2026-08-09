'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'
import { revalidatePath } from 'next/cache'

export async function addCategory(data: { name: string, slug: string, sort_order: number }) {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    throw new Error('Unauthorized')
  }

  const supabase = await createAdminClient()
  
  const { error } = await supabase
    .from('opp_categories')
    .insert({
      name: data.name,
      slug: data.slug,
      sort_order: data.sort_order,
      is_active: true
    })

  if (error) {
    throw new Error(`Failed to add category: ${error.message}`)
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    throw new Error('Unauthorized')
  }

  const supabase = await createAdminClient()
  
  const { error } = await supabase
    .from('opp_categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`)
  }

  revalidatePath('/admin/categories')
  return { success: true }
}
