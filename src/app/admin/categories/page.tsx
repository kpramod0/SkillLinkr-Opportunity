import { createClient } from '@/lib/supabase-server'
import { requireAuth } from '@/app/actions/auth-helpers'
import { redirect } from 'next/navigation'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
  }

  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('opp_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return <CategoriesClient initialCategories={categories || []} />
}
