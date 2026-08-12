export function isFacebookAdvert(url) {
  return /(?:facebook\.com|fb\.com)/i.test(String(url || ''))
}

export async function saveMotorhome(supabase, motorhome) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  const user = userData?.user

  if (userError || !user) {
    throw new Error(userError?.message || 'Please sign in again before saving')
  }

  if (motorhome.id) {
    const update = {
      ...motorhome,
      updated_by: user.id,
    }
    const { error } = await supabase
      .from('motorhomes')
      .update(update)
      .eq('id', motorhome.id)

    if (error) throw error
    return { motorhome: update, created: false }
  }

  const { data: membership, error: membershipError } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError || !membership?.household_id) {
    throw new Error(
      membershipError?.message || 'Your shared household could not be found',
    )
  }

  const insert = {
    ...motorhome,
    id: motorhome.id || globalThis.crypto.randomUUID(),
    household_id: membership.household_id,
    created_by: user.id,
    updated_by: user.id,
  }
  const { error } = await supabase.from('motorhomes').insert(insert)

  if (error) throw error
  return { motorhome: insert, created: true }
}
