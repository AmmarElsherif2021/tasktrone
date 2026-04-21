import supabase from '../../supabaseClient';

// Replace the existing signup function
export const signup = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  // Immediately sign in so we have a valid JWT for the RLS INSERT below
  if (!data.session) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw new Error(signInError.message);
    return signInData;
  }

  return data;
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);
  return data;
};

// Google Sign-In function
export const signInWithGoogle = async (redirectTo = window.location.origin) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
};

// Function to handle post-OAuth profile completion
export const completeOAuthProfile = async (profileData) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw new Error('Not authenticated');
  if (!user) throw new Error('No user found');

  // Generate username from email if not provided
  const username = profileData.username || 
    user.email.split('@')[0] + Math.floor(Math.random() * 1000);

  // Create public profile with required fields
  const { error: profileError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      username,
      full_name: profileData.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
      role: profileData.role || 'machine_operator',
      team: profileData.team || 'support_teams',
      phone: profileData.phone || user.user_metadata?.phone || null,
      //avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      is_active: true
    }, {
      onConflict: 'id'
    });

  if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);
  return { success: true };
};

// Check if user needs profile completion
export const checkUserProfileStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role, team, full_name')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile found - needs completion
      return { needsCompletion: true, profile: null };
    }

    if (error) {
      console.error('Database error checking profile:', error);
      throw error;
    }

    // Check if profile has required fields
    const needsCompletion = !data.username || !data.role || !data.team;
    
    return { 
      needsCompletion, 
      profile: data 
    };
  } catch (error) {
    console.error('Error checking profile status:', error);
    // If we can't check the profile, assume it needs completion
    return { needsCompletion: true, profile: null };
  }
};

// Create or update user profile from OAuth data
export const createOAuthUserProfile = async (user) => {
  try {
    // Extract data from OAuth user object
    // const userData = {
    //   id: user.id,
    //   email: user.email,
    //   full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
    //   //avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    //   provider: user.app_metadata?.provider || 'google'
    // };

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, username, role, team')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      // User exists, check if profile is complete
      const needsCompletion = !existingUser.username || !existingUser.role || !existingUser.team;
      return { needsCompletion, profile: existingUser };
    }

    // User doesn't exist, they need to complete their profile
    return { needsCompletion: true, profile: null };

  } catch (error) {
    console.error('Error in createOAuthUserProfile:', error);
    return { needsCompletion: true, profile: null };
  }
};

// Fixed getUserInfo function - removed admin call that causes 403 errors
export const getUserInfo = async (userId) => {
  try {
    // Only try to get from public.users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      throw new Error(error.message);
    }

    if (data) return data;

    // If no public profile, return null (don't try admin call)
    return null;
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

export const getUserProfileImage = async (userId) => {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.png`);

  return data.publicUrl;
};

// Sign out function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};